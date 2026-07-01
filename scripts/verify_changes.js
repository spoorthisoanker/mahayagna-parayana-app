#!/usr/bin/env node
/*
 * verify_changes.js — automated verification of the v0.10.0 feedback changes.
 * Place at scripts/verify_changes.js and run from the repo root:
 *   node scripts/verify_changes.js
 * Exit 0 = all pass, 1 = failures. UI/timing items need the manual checklist
 * (docs/feedback/v0.10.0-test-plan.md).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = process.env.GITA_ROOT || path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
let pass = 0, fail = 0;
function check(cond, msg) { if (cond) pass++; else { fail++; console.error('  ✗ ' + msg); } }
function section(t) { console.log('\n' + t); }
function loadJSON(f) { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch (e) { check(false, 'load ' + f + ': ' + e.message); return null; } }
function readSrc(r) { return fs.readFileSync(path.join(ROOT, r), 'utf8'); }

const HEADER_STY = new Set(['fh', 'sh', 'th', 'uh']);
function groupIntoPages(shlokas) {
  const result = [];
  for (const shloka of shlokas) {
    for (const hdr of shloka.entry.filter(e => HEADER_STY.has(e.sty))) result.push({ shlokaNum: shloka.shlokaNum, isHeader: true });
    const reg = shloka.entry.filter(e => !HEADER_STY.has(e.sty));
    if (reg.length > 0) {
      const first = (reg[0].iast || reg[0].text || '');
      const isCloser = /^\s*\|\|.*tatsaditi/.test(first) || /^\s*\|\|.*तत्सदिति/.test(first);
      const repeat = Math.max(1, parseInt(shloka.repeat, 10) || 1);
      for (let r = 0; r < repeat; r++) result.push({ shlokaNum: shloka.shlokaNum, isHeader: false, isCloser, repeatPass: r + 1, repeatTotal: repeat });
    }
  }
  return result;
}
function pageLabel(p, idx) {
  let t = p.isHeader ? 'Header' : p.isCloser ? 'Closing' : p.shlokaNum ? 'Shloka ' + p.shlokaNum : 'Page ' + (idx + 1);
  if (!p.isHeader && p.repeatTotal > 1) t += ' (' + p.repeatPass + '/' + p.repeatTotal + ')';
  return t;
}

const EXPECTED_ORDER = ['datta_stavam','invocation_prayers','0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','gita_mahatmyam','kshama_prarthana','gita_saram','gita_arati','purnam'];
const EXPECTED_BPM = { datta_stavam:360, invocation_prayers:340, chapter_01:340, chapter_02:380, chapter_03:380, chapter_04:380, chapter_05:380, chapter_06:380, chapter_07:380, chapter_08:380, chapter_09:380, chapter_10:380, chapter_11:380, chapter_12:380, chapter_13:380, chapter_14:380, chapter_15:380, chapter_16:380, chapter_17:380, chapter_18:380, gita_mahatmyam:380, kshama_prarthana:320 };
const NO_BPM = ['gita_saram','gita_arati','sadguru_stavam'];
const CH18_COLOPHON = [
  '||ōṁ tatsaditi śrīmanmahābhāratē',
  'śatasāhasrikāyāṁ saṁhitāyāṁ vaiyāsikyāṁ',
  'śrīmadbhīṣmaparvaṇi śrīmadbhagavadgītāsu',
  'upaniṣatsu brahmavidyāyāṁ yōgaśāstrē',
  'śrīkṛṣṇārjuna saṁvādē mōkṣasannyāsayōgōnāma',
  'aṣṭādaśōdhyāyaḥ||'
];

section('1. Chapter order (both engines; Sadguru removed, Purnam added)');
{
  const ext = src => { const m = src.match(/CHAPTER_ORDER\s*=\s*\[([\s\S]*?)\]/); return m ? m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean) : null; };
  const so = ext(readSrc('src/shared.js')), io = ext(readSrc('index.html'));
  check(JSON.stringify(so) === JSON.stringify(EXPECTED_ORDER), 'src/shared.js CHAPTER_ORDER matches expected');
  check(JSON.stringify(io) === JSON.stringify(EXPECTED_ORDER), 'index.html CHAPTER_ORDER matches expected');
  check(JSON.stringify(so) === JSON.stringify(io), 'both engines CHAPTER_ORDER identical');
  check(so && !so.includes('sadguru_stavam'), 'sadguru_stavam removed from order');
  check(so && so[so.length - 1] === 'purnam', 'purnam is last');
}

section('2. Per-section default tempo');
{
  for (const [f, b] of Object.entries(EXPECTED_BPM)) { const d = loadJSON(f + '.json'); if (d) check(d.defaultBpm === b, f + ' defaultBpm=' + b + ' (got ' + d.defaultBpm + ')'); }
  for (const f of NO_BPM) { const d = loadJSON(f + '.json'); if (d) check(d.defaultBpm === undefined, f + ' has no defaultBpm'); }
  check(/"defaultBpm":\s*300/.test(readSrc('src/shared.js')), 'EMBEDDED_DHYANA defaultBpm=300 (shared.js)');
  check(/"defaultBpm":\s*300/.test(readSrc('index.html')), 'EMBEDDED_DHYANA defaultBpm=300 (index.html)');
}

section('3. Samarpana (kshama_prarthana.json)');
{
  const k = loadJSON('kshama_prarthana.json');
  if (k) {
    check(k.name === 'samarpaṇa', 'renamed to samarpaṇa');
    // shloka 4 is now split into two objects: line1 (repeat:3) + line2 (once) → [1,2,3,4,4,6]
    check(JSON.stringify(k.shloka.map(s => String(s.shlokaNum))) === JSON.stringify(['1','2','3','4','4','6']), 'shlokas [1,2,3,4,4,6] (slide-4 split)');
    const s2 = k.shloka.find(s => String(s.shlokaNum) === '2');
    check(s2 && !s2.entry.some(e => (e.iast || '') === 'kṣamā prārthanā'), 'shloka 2 has no kṣamā prārthanā line');
    const fours = k.shloka.filter(s => String(s.shlokaNum) === '4');
    check(fours.length === 2, 'shloka 4 split into two objects');
    const s4a = fours[0], s4b = fours[1];
    check(s4a && s4a.repeat === 3 && /acyutāya namaḥ/.test(s4a.entry[0].iast || ''), 'shloka 4 line1 (acyutāya namaḥ) repeat:3');
    check(s4b && !s4b.repeat && /acyutānantagōvindēbhyō/.test(s4b.entry[0].iast || ''), 'shloka 4 line2 once, no repeat');
    check(fours.every(s => !/\(x\s*3\)/.test(JSON.stringify(s.entry))), 'no (x 3) marker');
    check(!k.shloka.some(s => /pūrṇamadaḥ/.test(JSON.stringify(s.entry))), 'pūrṇam mantra removed');
  }
}

section('4. Purnam chapter');
{
  const p = loadJSON('purnam.json');
  if (p) {
    check(p.name === 'pūrṇam' && p.chapterNum === 'purnam', 'name/chapterNum correct');
    check(p.defaultBpm === undefined, 'no defaultBpm');
    check(p.shloka.length === 2, 'two shlokas');
    const all = p.shloka.flatMap(s => s.entry.map(e => e.iast)).join(' ');
    check(/pūrṇamadaḥ/.test(all) && /śāntiḥ śāntiḥ śāntiḥ/.test(all), 'pūrṇam mantra + triple śāntiḥ');
  }
}

section('5. Gita Saram & Gita Arati lyrics restored (#33) + Saram repetition (#28)');
{
  const gs = loadJSON('gita_saram.json');
  if (gs) {
    check(gs.shloka.length > 5, 'gita_saram has verse lyrics (not heading-only) — ' + gs.shloka.length + ' shlokas');
    const reps = gs.shloka.filter(s => s.repeat && s.repeat > 1);
    check(reps.length >= 3, 'gita_saram has repetition (#28): ' + reps.length + ' repeated units');
    check(gs.shloka.some(s => /pallavi/i.test(JSON.stringify(s))), 'gita_saram has the Pallavi refrain');
  }
  const ga = loadJSON('gita_arati.json');
  if (ga) {
    check(ga.shloka.length > 5, 'gita_arati has verse lyrics — ' + ga.shloka.length + ' shlokas');
    // spellings fixed from PDF (no abbreviated "jay"/"kamal" forms)
    const joined = JSON.stringify(ga.shloka);
    check(/jaya\s+bhagavadgītē/.test(joined) && !/"jay\b/.test(joined), 'gita_arati uses full spellings (jaya, not jay)');
  }
  const gm = loadJSON('gita_mahatmyam.json');
  if (gm) check(gm.shloka.length > 20, 'gita_mahatmyam present (' + gm.shloka.length + ' shlokas, 4-line layout #35)');
}

section('6. Data corrections (Ch6, Ch13, Ch15, Ch18, Datta)');
{
  const c6 = loadJSON('chapter_06.json');
  if (c6) {
    const s1 = c6.shloka.find(s => String(s.shlokaNum) === '1');
    check(s1 && s1.entry.filter(e => /bhagavānuvāca/.test(e.iast || '')).length === 1, 'Ch6.1 one bhagavānuvāca (dup removed)');
    const s33 = c6.shloka.find(s => String(s.shlokaNum) === '33');
    check(s33 && !/‌|‍/.test(JSON.stringify(s33.entry)), 'Ch6.33 no zero-width joiner');
    check(s33 && s33.entry.some(e => /cañcalatvāt\s+sthitiṃ/.test(e.iast || '')), 'Ch6.33 two words');
  }
  const c13 = loadJSON('chapter_13.json');
  if (c13) check(c13.iastName === 'kṣētrakṣētrajñavibhāgayōgaḥ', 'Ch13 iastName no stray space');
  const c15 = loadJSON('chapter_15.json');
  if (c15) check(c15.iastName === 'puruṣōttamaprāptiyōgaḥ', 'Ch15 title corrected');
  const c18 = loadJSON('chapter_18.json');
  if (c18) {
    const col = c18.shloka.find(s => s.entry.some(e => /tatsaditi/.test(e.iast || '')));
    const lines = col ? col.entry.map(e => e.iast) : [];
    check(JSON.stringify(lines) === JSON.stringify(CH18_COLOPHON), 'Ch18 colophon matches the 6 expected lines');
  }
  const dt = loadJSON('datta_stavam.json');
  if (dt) {
    const pg = groupIntoPages(dt.shloka);
    check(pg.length === 11, 'Datta Stavam 11 pages (incl. trailing invocation slide #31) got ' + pg.length);
    const last = dt.shloka[dt.shloka.length - 1];
    check(last && /gaṇēśāya namaḥ/.test(last.entry[0].iast || ''), 'Datta Stavam ends with the invocation slide (#31)');
  }
}

section('7. Page labels + repeat expansion');
{
  const c7 = loadJSON('chapter_07.json');
  if (c7) {
    const pg = groupIntoPages(c7.shloka), cl = pg.filter(p => p.isCloser);
    check(cl.length === 1, 'Ch7 one isCloser page');
    check(pageLabel(pg[0], 0) === 'Header', 'Ch7 first page = "Header" (not Shloka 0)');
    check(cl.length === 1 && pageLabel(cl[0], pg.indexOf(cl[0])) === 'Closing', 'Ch7 colophon = "Closing" (not Shloka 31)');
  }
  const c17 = loadJSON('chapter_17.json');
  if (c17) check(groupIntoPages(c17.shloka).filter(p => p.isCloser).length === 1, 'Ch17 one colophon (17.23 not false-tagged)');
  const k = loadJSON('kshama_prarthana.json');
  if (k) {
    const fourPages = groupIntoPages(k.shloka).filter(p => p.shlokaNum === '4');
    // line1 (repeat:3) → 3 labelled pages, then line2 → 1 page = 4 pages total
    check(fourPages.length === 4, 'Samarpana shloka 4 -> 4 pages (line1 ×3 + line2 ×1)');
    check(fourPages.slice(0, 3).map(p => pageLabel(p, 0)).join(',') === 'Shloka 4 (1/3),Shloka 4 (2/3),Shloka 4 (3/3)', 'line1 passes labelled (1/3)(2/3)(3/3)');
    check(fourPages[3] && fourPages[3].repeatTotal === 1, 'line2 shown once (no repeat)');
  }
}

section('8. Animator pause model — data-driven (QA #36 issues 1,2,5)');
{
  const s = readSrc('src/shared.js');
  const idx = readSrc('index.html');
  check(/const\s+LINE_END_PAUSE_BEATS\s*=\s*3/.test(s), 'LINE_END_PAUSE_BEATS fallback = 3');
  check(!/SLOKA_END_PAUSE_MS/.test(s), 'SLOKA_END_PAUSE_MS removed');
  // data-driven line-end pause hook in the animator
  check(/parseFloat\(el\.dataset\.lineEndPauseBeats\)/.test(s), 'animator reads dataset.lineEndPauseBeats (shared.js)');
  check(/parseFloat\(el\.dataset\.lineEndPauseBeats\)/.test(idx), 'animator reads dataset.lineEndPauseBeats (index.html)');
  // header lines get a 3-mātrā pause (Issue 1); verse lines tristubh→4 else 3 (Issue 2)
  check(/dataset\.lineEndPauseBeats\s*=\s*'3'/.test(s), 'header line pause = 3 (shared.js)');
  check(/tristubh'\s*\?\s*'4'\s*:\s*'3'/.test(s), 'verse pause tristubh→4 else 3 (shared.js)');
  check(/tristubh'\s*\?\s*'4'\s*:\s*'3'/.test(idx), 'verse pause tristubh→4 else 3 (index.html)');
  // even pointer movement (per-line average beats) retained
  check(/avgBeats/.test(s) && /parseFloat\(el\.dataset\.beats\)/.test(s), 'even-movement avg beats retained (shared.js)');
}

section('9. Operator settings panel');
{
  const op = readSrc('src/operator.js');
  check(/CHANT_DEFAULTS\s*=/.test(op), 'CHANT_DEFAULTS defined');
  // line-pause + dhyana-sloka-end settings were removed (now data-driven)
  for (const k of ['colophonBpmDrop','countdownSeconds','chapterGapSeconds','sectionBpm']) check(new RegExp(k).test(op), 'CHANT_DEFAULTS has ' + k);
  check(!/lineEndPauseBeats\s*:/.test(op), 'line-end-pause setting key removed (now data-driven)');
  check(!/dhyanaSlokaEndMs\s*:/.test(op), 'dhyana-sloka-end setting key removed');
  check(!/id="set-line-end"/.test(readSrc('src/operator.html')), 'line-end-pause input removed from panel');
  check(/gitaChantSettings/.test(op), 'persists to localStorage gitaChantSettings');
  check(!/var\s+count\s*=\s*5\b/.test(op), 'countdown not hardcoded to 5');
  check(!/COLOPHON_BPM_DROP\s*=\s*20/.test(op), 'colophon drop not hardcoded const');
  check(/id="settings-overlay"/.test(readSrc('src/operator.html')), 'settings panel markup present');
  check(!/id="chapter-gap"/.test(readSrc('src/operator.html')), 'chapter-gap select folded into panel');
  check(!/CHANT_DEFAULTS/.test(readSrc('index.html')), 'web index.html has no settings panel (operator-only)');
}

section('10. New issue work (#20/#21 dhyana meter, #26 uvaca, #30 titles, #34 zoom)');
{
  const sh = readSrc('src/shared.js');
  const op = readSrc('src/operator.js');
  // Gita Saram/Arati now play through (stay-on-title special-cases removed since lyrics restored)
  check(!/chapterId === 'gita_saram' \|\| chapterId === 'gita_arati'\) return/.test(op), 'stay-on-title special-case removed (sections have lyrics now)');
  // #20/#21: EMBEDDED_DHYANA shlokas carry a meter; renderInto uses it for Dhyana
  check(/"meter":\s*"tristubh"/.test(sh) && /"meter":\s*"anustubh"/.test(sh), 'EMBEDDED_DHYANA has meter fields (#20/#21)');
  // #26: uvaca lines tagged splitEnd (no pause)
  check(/uvāca/.test(sh) && /splitEnd/.test(sh), 'uvāca-line splitEnd handling present (#26)');
  // #30: chapter titles spaced (ch1 title entry)
  const c1 = loadJSON('chapter_01.json');
  if (c1) check(c1.shloka[0].entry.some(e => (e.iast || '') === 'arjuna viṣāda yōgaḥ'), 'Ch1 title spaced "arjuna viṣāda yōgaḥ" (#30)');
  // #34: verse zoom setting + projector CSS var
  check(/verseZoom/.test(op), 'verseZoom setting present (#34)');
  check(/--verse-zoom/.test(readSrc('src/projector.html')), 'projector verse-zoom CSS var (#34)');
}

console.log('\n' + '='.repeat(56));
if (fail === 0) { console.log('✅ ALL ' + pass + ' CHECKS PASSED'); console.log('Next: manual checklist docs/feedback/v0.10.0-test-plan.md'); process.exit(0); }
else { console.log('❌ ' + fail + ' FAILED, ' + pass + ' passed'); process.exit(1); }
