#!/usr/bin/env node
/* verify_syllable_counts.js — spot-review for QA Issue #2 output. */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(path.resolve(__dirname, '..'), 'data');
const FILES = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).sort();

let ok = 0, bad = 0;
const dist = { anustubh: 0, tristubh: 0 };

for (const f of FILES) {
  const fp = path.join(DATA_DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(fp, 'utf8')); ok++; }
  catch (e) { bad++; console.error(`INVALID JSON: ${f} -> ${e.message}`); continue; }
  if (!Array.isArray(data.shloka)) continue;
  for (const sh of data.shloka) {
    if (sh.meter) dist[sh.meter] = (dist[sh.meter] || 0) + 1;
  }
}
console.log(`JSON parse: ${ok} ok, ${bad} invalid`);
console.log(`Meter distribution: anustubh=${dist.anustubh}, tristubh=${dist.tristubh}\n`);

function table(file, max) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  console.log(`--- ${file} ---`);
  let n = 0;
  for (const sh of data.shloka) {
    if (sh.syllables === undefined) continue;
    const perPada = (sh.syllables / sh.entry.filter(e => !['fh','sh','th','uh'].includes(e.sty)).length).toFixed(1);
    console.log(`  shloka ${String(sh.shlokaNum||'""').padEnd(4)} syll=${String(sh.syllables).padStart(3)} perPada=${String(perPada).padStart(4)} meter=${sh.meter}`);
    if (++n >= max) break;
  }
}

// Ch2: regular anustubh verses; invocation prayers shloka 2 = tristubh (11-syll padas)
table('chapter_02.json', 8);
table('invocation_prayers.json', 5);
