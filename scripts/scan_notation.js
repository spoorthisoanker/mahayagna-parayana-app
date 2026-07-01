#!/usr/bin/env node
// Scan all chapters for #27 line-structure anomalies:
//  (A) a verse entry that DUPLICATES another in the same sloka (modulo whitespace)
//  (B) verse slokas whose line count != 4 (possible merged/extra pādas)
'use strict';
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const HEADER = new Set(['fh', 'sh', 'th', 'uh']);
const norm = s => (s || '').replace(/\s+/g, '').replace(/\|+/g, '').replace(/\d/g, '');

let dupCount = 0, oddCount = 0;
for (let n = 1; n <= 18; n++) {
  const f = 'chapter_' + String(n).padStart(2, '0') + '.json';
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
  for (const s of d.shloka) {
    const verse = s.entry.filter(e => !HEADER.has(e.sty));
    if (verse.length === 0) continue;
    // (A) duplicates within the sloka
    const seen = {}, dups = [];
    verse.forEach((e, i) => {
      const k = norm(e.iast);
      if (!k) return;
      if (seen[k] !== undefined) dups.push(i);
      else seen[k] = i;
    });
    if (dups.length) { dupCount++; console.log('DUP  ch' + n + '.' + s.shlokaNum + '  entries=' + verse.length + '  dupIdx=' + dups.join(',') + '  ::  ' + verse.map(e => e.iast).join(' / ')); }
    // (B) odd line count (most are anuṣṭubh = 4; flag !=4 that aren't dup-explained)
    else if (verse.length !== 4) { oddCount++; }
  }
}
console.log('\nTotal slokas WITH duplicate entries (pattern A):', dupCount);
console.log('Total verse slokas with line-count != 4 and no dup (pattern B candidates):', oddCount);
