// Compute meter (anustubh/tristubh) per Dhyana shloka using iastProsody splitSyllables.
// A "pada" = one main line + its following cont:true continuation line(s).
// pada syllable count >= 10 => tristubh, else anustubh.
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'shared.js'), 'utf8');

// Extract iastProsody IIFE source (DOM-free) and eval it.
const startTok = 'const iastProsody = (function() {';
const start = src.indexOf(startTok);
const after = src.indexOf('})();', start);
const iastSrc = src.slice(start, after + '})();'.length)
  .replace('const iastProsody =', 'globalThis.iastProsody =');
eval(iastSrc); // assigns globalThis.iastProsody from our own trusted source

// Extract EMBEDDED_DHYANA object literal
const dStart = src.indexOf('const EMBEDDED_DHYANA = {');
const dAfter = src.indexOf('\n};', dStart);
const dSrc = src.slice(dStart + 'const EMBEDDED_DHYANA = '.length, dAfter + 2);
const EMBEDDED_DHYANA = eval('(' + dSrc + ')');

function sylCount(iast) {
  return globalThis.iastProsody.analyzeLine(iast).filter(t => !t.isMarker).length;
}

for (const shloka of EMBEDDED_DHYANA.shloka) {
  const reg = shloka.entry.filter(e => !['fh','sh','th','uh'].includes(e.sty));
  if (reg.length === 0) {
    console.log(`shloka "${shloka.shlokaNum}": (header only, no meter)`);
    continue;
  }
  const padas = [];
  let cur = null;
  for (const e of reg) {
    if (!e.cont) {
      if (cur) padas.push(cur);
      cur = { count: sylCount(e.iast), parts: [e.iast] };
    } else {
      if (!cur) cur = { count: 0, parts: [] };
      cur.count += sylCount(e.iast);
      cur.parts.push(e.iast);
    }
  }
  if (cur) padas.push(cur);

  const counts = padas.map(p => p.count);
  const maxCount = Math.max(...counts);
  const meter = maxCount >= 10 ? 'tristubh' : 'anustubh';
  console.log(`shloka "${shloka.shlokaNum}": padas=${counts.join(',')} max=${maxCount} -> ${meter} (${reg.length} lines)`);
}
