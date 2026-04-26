const fs = require('fs');
const content = fs.readFileSync('content/courses/excel.ts', 'utf8');
const BT = String.fromCharCode(96);

function findCloser(str, start) {
  let idx = start;
  while (idx < str.length) {
    const pos = str.indexOf(BT + ',', idx);
    if (pos === -1) return -1;
    const nextChar = str[pos + 2];
    if (nextChar === '\r' || nextChar === '\n') return pos;
    idx = pos + 1;
  }
  return -1;
}

const openerRe = new RegExp('[0-9]+: ' + BT, 'g');
let m;
let bareTotal = 0;

while ((m = openerRe.exec(content)) !== null) {
  const bodyStart = m.index + m[0].length;
  const closerIdx = findCloser(content, bodyStart);
  if (closerIdx === -1) continue;
  const body = content.slice(bodyStart, closerIdx);

  for (let i = 0; i < body.length; i++) {
    if (body[i] === BT) {
      const prev = i > 0 ? body[i-1] : '';
      if (prev !== '\\') {
        bareTotal++;
        console.log('Bare BT at body pos', i, 'lesson at', m.index);
        console.log('  Context:', JSON.stringify(body.slice(Math.max(0,i-20), i+20)));
      }
    }
  }
}

console.log('Remaining bare backticks:', bareTotal);
