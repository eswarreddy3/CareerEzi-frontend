const fs = require('fs');
const content = fs.readFileSync('content/courses/excel.ts', 'utf8');
const idx = content.indexOf('Company_Finance_2024');
console.log('Index:', idx);
for (let i = idx-5; i < idx+25; i++) {
  const code = content.charCodeAt(i);
  const ch = content[i];
  process.stdout.write(code + '(' + ch + ') ');
}
console.log();
// Is char before Company a proper escaped backtick?
// \` would be: 92 (backslash) then 96 (backtick)
console.log('Chars before Company:', content.charCodeAt(idx-1), content.charCodeAt(idx-2), content.charCodeAt(idx-3));
