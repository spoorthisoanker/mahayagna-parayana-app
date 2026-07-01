#!/usr/bin/env node
// Data invariants for parayana chapters. Run: node scripts/check_data.js
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');
let failures = 0;
function check(cond, msg) { if (!cond) { console.error('FAIL: ' + msg); failures++; } }

// Load + parse a data file, isolating I/O/parse errors into a clean failure
// so one bad file doesn't short-circuit the rest of the checks.
function load(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
  } catch (err) {
    check(false, 'could not load ' + file + ': ' + err.message);
    return null;
  }
}

// kshama shloka 4 must repeat 3x with the literal "(x 3)" marker stripped (Task 11)
const k = load('kshama_prarthana.json');
if (k) {
  const s4 = k.shloka.find(s => String(s.shlokaNum) === '4');
  check(s4 && s4.repeat === 3, 'kshama shloka 4 must have repeat:3');
  check(s4 && !/\(x\s*3\)/.test(JSON.stringify(s4.entry)), 'kshama shloka 4 still has literal (x 3) marker');
}

// chapter_06 shloka 33 last line: "cañcalatvāt" + space + "sthitiṃ" — two SEPARATE
// words. A U+200C ZWNJ there had wrongly glued them together (Task 13). This is the
// only ZWNJ we enforce against: ch9's matsthāni ZWNJ is a single-word typographic
// choice the original author made, so we intentionally do NOT ban ZWNJ globally.
const c6 = load('chapter_06.json');
if (c6) {
  const s33 = c6.shloka.find(s => String(s.shlokaNum) === '33');
  const last = s33 && s33.entry[s33.entry.length - 1];
  check(last && /cañcalatvāt\s+sthitiṃ/.test(last.iast) && !/cañcalatvāt‌/.test(last.iast),
    'chapter_06 6.33 must read "cañcalatvāt sthitiṃ" (space-separated, no ZWNJ)');
}

// Informational only (non-failing): list any files that still contain ZWNJ/ZWJ, so
// stray zero-width chars stay visible without forcing edits to intentional ones (ch9).
for (const file of fs.readdirSync(DATA).filter(f => f.endsWith('.json'))) {
  const raw = fs.readFileSync(path.join(DATA, file), 'utf8');
  if (raw.includes('‌') || raw.includes('‍')) {
    console.log('INFO: ' + file + ' contains zero-width chars (ZWNJ/ZWJ) — verify intentional');
  }
}

if (failures) { console.error(failures + ' check(s) failed'); process.exit(1); }
console.log('OK — all data checks passed');
