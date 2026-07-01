#!/usr/bin/env node
// #31: append the Invocation Prayers opening slide (śrī gaṇēśāya namaḥ …) to the
// end of Datta Stavam — it should appear in both places. Run once.
'use strict';
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const datta = JSON.parse(fs.readFileSync(path.join(DATA, 'datta_stavam.json'), 'utf8'));
const inv = JSON.parse(fs.readFileSync(path.join(DATA, 'invocation_prayers.json'), 'utf8'));

const slide = JSON.parse(JSON.stringify(inv.shloka[0])); // the gaṇēśāya invocation
// #31 wants this slide at the END of Datta Stavam (it already opens it). Skip only
// if the LAST shloka is already this slide (idempotency on re-run).
const last = datta.shloka[datta.shloka.length - 1];
if (last && last.entry && last.entry[0] && /gaṇēśāya namaḥ/.test(last.entry[0].iast || '')) {
  console.log('end slide already present — no change'); process.exit(0);
}

datta.shloka.push(slide);
fs.writeFileSync(path.join(DATA, 'datta_stavam.json'), JSON.stringify(datta), 'utf8'); // keep minified
console.log('appended invocation slide; datta_stavam shlokas now', datta.shloka.length);
console.log('last shloka first line:', datta.shloka[datta.shloka.length - 1].entry[0].iast);
