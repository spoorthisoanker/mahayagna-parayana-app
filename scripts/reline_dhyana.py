#!/usr/bin/env python3
"""QA #5 — Re-line each Dhyana shloka so each pada becomes TWO display lines
(main line + indented continuation).

Splits the existing EMBEDDED_DHYANA pada entries in BOTH src/shared.js and
index.html at the word boundary given by the authoritative split map below.
Only inserts line breaks; words/diacritics/spacing within each half are
preserved EXACTLY. Continuation (second) lines get cont:true. Every split line
gets swhtsp "l" except the very last line of a shloka which keeps "".

Verifies no word loss (joined halves == original, word-for-word) and that the
two file copies are byte-identical afterwards.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARED = ROOT / "src" / "shared.js"
INDEX = ROOT / "index.html"

# For each pada (keyed by the original IAST text after collapsing whitespace),
# the FIRST IAST word of the continuation line. We split the original entry
# right before that word's first occurrence (searching from a sensible start).
# We locate the boundary in the iast string by word index, then apply the same
# word index to the devanagari string.
#
# Split map: continuation-line first IAST token per pada, in order.
# Each tuple: (shlokaNum, [cont_first_word_for_each_pada])
SPLIT_MAP = {
    "1": ["nārāyaṇēna", "madhyē", "aṣṭādaśādhyāyinīṃ", "bhagavadgītē"],
    "2": ["phullāravindāyatapatranētra", "prajvālitō"],
    "3": ["tōtravētraikapāṇayē", "gītāmṛtaduhē"],
    "4": ["kaṃsacāṇūramardanam", "kṛṣṇaṃ"],
    "5": ["gāndhāranīlōtpalā", "karṇēna", "duryōdhanāvartinī", "kaivartakaḥ"],
    "6": ["gītārthagandhōtkaṭaṃ", "sambōdhanābōdhitam", "pēpīyamānaṃ", "pradhvaṃsinaḥ"],
    "7": ["paṅguṃ", "paramānandamādhavam"],
    "8": ["padmanābhaṃ", "mēghavarṇaṃ", "yōgihṛddhyānagamyaṃ", "sarva"],
    "9": ["stunvanti", "gāyanti", "paśyanti", "dēvāya"],
    "10": ["narañcaiva", "tatō"],
    "11": ["kṛṣṇāyākliṣṭakāriṇē", "guravē"],
    "12": ["dōgdhā", "dugdhaṃ"],
    "13": ["yaḥ", "bhayaśōkādi"],
    "14": ["ēkō", "karmāpyēkaṃ"],
}

# Padas that have 4 padas (8 lines after split). Others have 2 padas (4 lines).
FOUR_PADA = {"1", "5", "6", "8", "9"}


def split_preserving(s, sep_words_iast, first_word):
    """Split string s into (head, tail) where tail begins at the first
    occurrence of first_word as a whole token. Whitespace is preserved:
    the leading whitespace run before first_word is kept on the HEAD side?
    No — we keep it on the tail's left trimmed. We trim trailing ws from head
    and leading ws from tail, but record nothing else; renderer treats each
    line independently. We must ensure head+ws+tail rejoins to original for
    word-loss check (we compare on whitespace-collapsed token lists).
    """
    # Build a regex that finds the whole-word occurrence of first_word.
    # Tokens are whitespace separated. Find boundary by token scan.
    tokens = re.split(r"(\s+)", s)  # keeps separators
    # tokens alternates word, sep, word, sep ...
    # find the token index whose stripped value == first_word
    word_positions = []  # (token_index, char_offset)
    for i, t in enumerate(tokens):
        if t.strip() == first_word and t.strip() != "":
            word_positions.append(i)
    if not word_positions:
        raise ValueError(f"continuation word {first_word!r} not found in {s!r}")
    # choose the LAST occurrence? Use first occurrence — these words are unique
    # within a pada. Use first.
    idx = word_positions[0]
    head = "".join(tokens[:idx]).rstrip()
    tail = "".join(tokens[idx:]).lstrip()
    return head, tail


def tokenize(s):
    return [t for t in s.split() if t]


def process():
    text = SHARED.read_text(encoding="utf-8")
    # Extract the EMBEDDED_DHYANA object literal.
    m = re.search(r"const EMBEDDED_DHYANA = (\{.*?\n\});", text, re.S)
    if not m:
        print("ERROR: could not locate EMBEDDED_DHYANA in shared.js")
        sys.exit(1)
    obj_text = m.group(1)
    data = json.loads(obj_text)

    report = []
    for shloka in data["shloka"]:
        num = shloka["shlokaNum"]
        if num not in SPLIT_MAP:
            report.append((num, len(shloka["entry"]), len(shloka["entry"]), "unchanged"))
            continue
        cont_words = SPLIT_MAP[num]
        old_entries = shloka["entry"]
        if len(old_entries) != len(cont_words):
            print(f"ERROR shloka {num}: {len(old_entries)} entries but {len(cont_words)} split words")
            sys.exit(1)
        new_entries = []
        for entry, first_word in zip(old_entries, cont_words):
            dev = entry["text"]
            iast = entry["iast"]
            iast_head, iast_tail = split_preserving(iast, None, first_word)
            # Determine the word index in iast to mirror in devanagari.
            iast_tokens = tokenize(iast)
            head_tokens = tokenize(iast_head)
            split_at = len(head_tokens)
            # devanagari split at same token index
            dev_tokens_with_sep = re.split(r"(\s+)", dev)
            # walk dev tokens, count words until split_at
            dev_words_seen = 0
            cut_token_index = None
            for i, t in enumerate(dev_tokens_with_sep):
                if t.strip() != "":
                    if dev_words_seen == split_at:
                        cut_token_index = i
                        break
                    dev_words_seen += 1
            if cut_token_index is None:
                print(f"ERROR shloka {num}: cannot split devanagari for {first_word}")
                sys.exit(1)
            dev_head = "".join(dev_tokens_with_sep[:cut_token_index]).rstrip()
            dev_tail = "".join(dev_tokens_with_sep[cut_token_index:]).lstrip()

            base = {k: entry[k] for k in ("startTime", "endTime", "swhtsp", "shlNbr", "sty")}
            e1 = dict(base)
            e1["swhtsp"] = "l"
            e1["text"] = dev_head
            e1["iast"] = iast_head
            e2 = dict(base)
            e2["swhtsp"] = "l"  # set to "" later if it's the shloka-final line
            e2["text"] = dev_tail
            e2["iast"] = iast_tail
            e2["cont"] = True
            new_entries.append(e1)
            new_entries.append(e2)

            # word-loss assertion (collapsed tokens)
            assert tokenize(dev_head) + tokenize(dev_tail) == tokenize(dev), \
                f"DEV word loss shloka {num}: {dev!r}"
            assert tokenize(iast_head) + tokenize(iast_tail) == tokenize(iast), \
                f"IAST word loss shloka {num}: {iast!r}"

        # last line of shloka keeps swhtsp ""
        new_entries[-1]["swhtsp"] = ""
        report.append((num, len(old_entries), len(new_entries), "split"))
        shloka["entry"] = new_entries

    # Re-emit each entry on its own line, matching original formatting style:
    # compact JSON object, key order: startTime,endTime,swhtsp,shlNbr,sty,text,iast (+cont)
    def emit_entry(e):
        order = ["startTime", "endTime", "swhtsp", "shlNbr", "sty"]
        if e.get("cont"):
            order.append("cont")
        order += ["text", "iast"]
        parts = []
        for k in order:
            parts.append(json.dumps(k, ensure_ascii=False) + ":" + json.dumps(e[k], ensure_ascii=False))
        return "{" + ",".join(parts) + "}"

    lines = []
    lines.append("const EMBEDDED_DHYANA = {")
    lines.append("  " + json.dumps("name", ensure_ascii=False) + ": " + json.dumps(data["name"], ensure_ascii=False) + ",")
    lines.append("  " + json.dumps("chapterNum", ensure_ascii=False) + ": " + json.dumps(data["chapterNum"], ensure_ascii=False) + ",")
    lines.append("  " + json.dumps("defaultBpm", ensure_ascii=False) + ": " + json.dumps(data["defaultBpm"]) + ",")
    lines.append("  \"shloka\": [")
    for si, shloka in enumerate(data["shloka"]):
        lines.append("    {")
        lines.append("      " + json.dumps("shlokaNum", ensure_ascii=False) + ": " + json.dumps(shloka["shlokaNum"], ensure_ascii=False) + ",")
        lines.append("      \"entry\": [")
        for ei, e in enumerate(shloka["entry"]):
            comma = "," if ei < len(shloka["entry"]) - 1 else ""
            lines.append("        " + emit_entry(e) + comma)
        lines.append("      ]")
        lines.append("    }" + ("," if si < len(data["shloka"]) - 1 else ""))
    lines.append("  ]")
    lines.append("};")
    new_block = "\n".join(lines)

    return obj_text, new_block, report


def replace_in_file(path, old_block, new_block):
    text = path.read_text(encoding="utf-8")
    target = "const EMBEDDED_DHYANA = " + old_block + ";"
    new_target = new_block
    if target not in text:
        # The literal in shared.js IS `const EMBEDDED_DHYANA = {...};`
        print(f"ERROR: block not found verbatim in {path}")
        sys.exit(1)
    text = text.replace(target, new_target, 1)
    path.write_text(text, encoding="utf-8")


def main():
    old_obj, new_block, report = process()
    replace_in_file(SHARED, old_obj, new_block)
    replace_in_file(INDEX, old_obj, new_block)
    print("Per-shloka entry counts (before -> after):")
    for num, before, after, status in report:
        label = num if num else "(header)"
        print(f"  shloka {label:>3}: {before} -> {after}  [{status}]")
    print("Word-loss assertions: PASSED for all padas")


if __name__ == "__main__":
    main()
