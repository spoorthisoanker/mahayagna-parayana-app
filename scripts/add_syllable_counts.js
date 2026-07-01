#!/usr/bin/env node
/*
 * add_syllable_counts.js — QA Issue #2
 *
 * Adds two top-level keys to every VERSE shloka in the chapter/prayer data
 * files:
 *   "syllables": <int>   — total syllables across the shloka's verse entries
 *   "meter": "anustubh" | "tristubh"
 *
 * Method (mirrors src/shared.js renderInto analyzer choice):
 *   - For each entry, skip header entries (sty in fh/sh/th/uh).
 *   - Choose engine: Devanagari prosody if entry.text has U+0900–U+097F,
 *     else iastProsody on (entry.iast || entry.text).
 *   - Syllable count of a line = number of analyzeLine tokens with
 *     isMarker === false.
 *   - shloka.syllables = sum over verse entries.
 *   - numPadas = number of verse entries.
 *   - perPada = syllables / numPadas.
 *   - meter = (perPada >= 10) ? "tristubh" : "anustubh".
 *   - If a shloka has only header entries, it is skipped (no keys added).
 *
 * Formatting is preserved per-file:
 *   - Standard pretty files (multi-line, 2-space)  -> JSON.stringify(.,null,2)
 *   - Minified single-line files                   -> JSON.stringify(.)
 *   - invocation_prayers.json hybrid (pretty outer, inline entry objects)
 *     -> custom serializer reproducing that layout.
 *
 * Run:  node scripts/add_syllable_counts.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const SHARED = path.join(ROOT, 'src', 'shared.js');

// ---------------------------------------------------------------------------
// 1. Extract the two DOM-free prosody IIFEs from src/shared.js and eval them.
// ---------------------------------------------------------------------------
function extractIIFE(src, declName) {
  const marker = `const ${declName} = (function() {`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`Could not find "${marker}" in shared.js`);
  // Find the matching closing "})();" by brace counting from the first "{".
  const braceStart = src.indexOf('{', start);
  let depth = 0;
  let i = braceStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  // i now at the closing "}" of the function body. Expect "})();" after it.
  const tail = src.indexOf(')();', i);
  if (tail < 0) throw new Error(`Could not find end of IIFE for ${declName}`);
  return src.slice(start, tail + ')();'.length);
}

function loadProsody() {
  const src = fs.readFileSync(SHARED, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  // `const X = (function(){...})()` is a lexical binding that does NOT become a
  // property of the context object, so append an explicit global assignment to
  // surface each engine on the sandbox.
  vm.runInContext(
    extractIIFE(src, 'iastProsody') + '\nthis.iastProsody = iastProsody;',
    sandbox, { filename: 'iastProsody.js' }
  );
  vm.runInContext(
    extractIIFE(src, 'prosody') + '\nthis.prosody = prosody;',
    sandbox, { filename: 'prosody.js' }
  );
  if (!sandbox.iastProsody || !sandbox.prosody) {
    throw new Error('Failed to evaluate prosody engines from shared.js');
  }
  return { prosody: sandbox.prosody, iastProsody: sandbox.iastProsody };
}

// ---------------------------------------------------------------------------
// 2. Syllable / meter computation.
// ---------------------------------------------------------------------------
const HEADER_STYLES = new Set(['fh', 'sh', 'th', 'uh']);
const DEVANAGARI = /[ऀ-ॿ]/;

function isHeaderEntry(entry) {
  return HEADER_STYLES.has(entry.sty);
}

function syllableCountForEntry(entry, engines) {
  const hasDev = DEVANAGARI.test(entry.text || '');
  const analyzer = hasDev ? engines.prosody : engines.iastProsody;
  const analyzeText = hasDev ? entry.text : (entry.iast || entry.text);
  const tokens = analyzer.analyzeLine(analyzeText || '');
  return tokens.filter(t => !t.isMarker).length;
}

/**
 * Mutates a shloka object in place, adding syllables/meter when it has verse
 * entries. Returns the meter string if applied, else null.
 */
function annotateShloka(shloka, engines) {
  if (!Array.isArray(shloka.entry)) return null;
  const verseEntries = shloka.entry.filter(e => !isHeaderEntry(e));
  if (verseEntries.length === 0) return null; // header-only shloka -> skip

  let syllables = 0;
  for (const e of verseEntries) syllables += syllableCountForEntry(e, engines);
  const numPadas = verseEntries.length;
  const perPada = syllables / numPadas;
  const meter = perPada >= 10 ? 'tristubh' : 'anustubh';

  shloka.syllables = syllables;
  shloka.meter = meter;
  return meter;
}

// ---------------------------------------------------------------------------
// 3. Formatting detection + serialization.
// ---------------------------------------------------------------------------
function detectStyle(raw) {
  const trimmed = raw.replace(/\n+$/, '');
  const lines = trimmed.split('\n');
  if (lines.length <= 1) return 'minified';
  // Hybrid: pretty outer, but entry objects written inline on one line.
  // Heuristic: a line that starts (after indent) with `{"text":` is an inline entry.
  if (lines.some(l => /^\s*\{"text":/.test(l))) return 'hybrid';
  return 'pretty';
}

// Reproduce the invocation_prayers.json hybrid layout: 2-space pretty for the
// document, but each entry object is serialized inline (JSON.stringify with no
// spacing) on its own line.
// Serialize a flat object inline with a space after ':' and ', ' between pairs,
// matching the original invocation_prayers.json entry layout.
function inlineObject(obj) {
  const parts = Object.keys(obj).map(k => JSON.stringify(k) + ': ' + JSON.stringify(obj[k]));
  return '{' + parts.join(', ') + '}';
}

function serializeHybrid(data) {
  const INDENT = '  ';
  function ser(value, depth) {
    const pad = INDENT.repeat(depth);
    const padIn = INDENT.repeat(depth + 1);
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(v => padIn + ser(v, depth + 1));
      return '[\n' + items.join(',\n') + '\n' + pad + ']';
    }
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      const items = keys.map(k => padIn + JSON.stringify(k) + ': ' + ser(value[k], depth + 1));
      return '{\n' + items.join(',\n') + '\n' + pad + '}';
    }
    return JSON.stringify(value);
  }
  // Walk: serialize normally, but when we hit an `entry` array, inline its items.
  function serRoot(value, depth) {
    const pad = INDENT.repeat(depth);
    const padIn = INDENT.repeat(depth + 1);
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(v => padIn + serRoot(v, depth + 1));
      return '[\n' + items.join(',\n') + '\n' + pad + ']';
    }
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      const items = keys.map(k => {
        if (k === 'entry' && Array.isArray(value[k])) {
          // inline each entry object
          const arr = value[k];
          if (arr.length === 0) return padIn + JSON.stringify(k) + ': []';
          const inner = arr.map(e => INDENT.repeat(depth + 2) + inlineObject(e));
          return padIn + JSON.stringify(k) + ': [\n' + inner.join(',\n') + '\n' + padIn + ']';
        }
        return padIn + JSON.stringify(k) + ': ' + serRoot(value[k], depth + 1);
      });
      return '{\n' + items.join(',\n') + '\n' + pad + '}';
    }
    return JSON.stringify(value);
  }
  return serRoot(data, 0);
}

function serialize(data, style) {
  if (style === 'minified') return JSON.stringify(data);
  if (style === 'hybrid') return serializeHybrid(data);
  return JSON.stringify(data, null, 2);
}

// ---------------------------------------------------------------------------
// 4. Driver.
// ---------------------------------------------------------------------------
const TARGET_FILES = [
  'chapter_01.json', 'chapter_02.json', 'chapter_03.json', 'chapter_04.json',
  'chapter_05.json', 'chapter_06.json', 'chapter_07.json', 'chapter_08.json',
  'chapter_09.json', 'chapter_10.json', 'chapter_11.json', 'chapter_12.json',
  'chapter_13.json', 'chapter_14.json', 'chapter_15.json', 'chapter_16.json',
  'chapter_17.json', 'chapter_18.json',
  'datta_stavam.json', 'invocation_prayers.json', 'gita_mahatmyam.json',
  'kshama_prarthana.json', 'sadguru_stavam.json', 'purnam.json',
];
// Explicitly skipped (header-only files, leave untouched):
//   gita_saram.json, gita_arati.json

function main() {
  const engines = loadProsody();
  const summary = [];
  let totalAnnotated = 0;
  const meterDist = { anustubh: 0, tristubh: 0 };

  for (const file of TARGET_FILES) {
    const fp = path.join(DATA_DIR, file);
    const raw = fs.readFileSync(fp, 'utf8');
    const hadTrailingNL = /\n$/.test(raw);
    const style = detectStyle(raw);
    const data = JSON.parse(raw);

    if (!Array.isArray(data.shloka)) {
      console.warn(`! ${file}: no shloka array, skipping`);
      continue;
    }

    let annotated = 0;
    for (const sh of data.shloka) {
      const meter = annotateShloka(sh, engines);
      if (meter) {
        annotated++;
        totalAnnotated++;
        meterDist[meter] = (meterDist[meter] || 0) + 1;
      }
    }

    let out = serialize(data, style);
    if (hadTrailingNL) out += '\n';
    fs.writeFileSync(fp, out, 'utf8');

    // Re-parse to confirm valid JSON.
    JSON.parse(fs.readFileSync(fp, 'utf8'));

    summary.push({ file, style, shlokas: data.shloka.length, annotated });
  }

  console.log('\n=== add_syllable_counts.js — summary ===');
  for (const s of summary) {
    console.log(
      `${s.file.padEnd(24)} style=${s.style.padEnd(9)} shlokas=${String(s.shlokas).padStart(3)} annotated=${String(s.annotated).padStart(3)}`
    );
  }
  console.log(`\nTotal shlokas annotated: ${totalAnnotated}`);
  console.log(`Meter distribution: anustubh=${meterDist.anustubh}, tristubh=${meterDist.tristubh}`);
}

if (require.main === module) main();

module.exports = { loadProsody, annotateShloka, syllableCountForEntry, detectStyle, serialize };
