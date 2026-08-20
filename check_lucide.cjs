const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');

function findImports(dir) {
  let icons = new Set();
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findImports(fullPath).forEach(i => icons.add(i));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const match = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
      if (match) {
        const imported = match[1].split(',').map(s => s.trim()).filter(Boolean);
        imported.forEach(i => icons.add(i));
      }
    }
  }
  return icons;
}

const icons = findImports('./src');
const missing = [];
for (const icon of icons) {
  if (!lucide[icon]) {
    missing.push(icon);
  }
}
console.log('Missing icons:', missing);
