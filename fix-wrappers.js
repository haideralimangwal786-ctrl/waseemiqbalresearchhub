const fs = require('fs');
const path = require('path');

const srcDirs = [
  path.join(__dirname, 'forntend', 'src', 'components'),
  path.join(__dirname, 'forntend', 'src', 'pages')
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');

      if (content.includes('className="flex justify-center items-center h-64"')) {
        content = content.replace(/className="flex justify-center items-center h-64"/g, 'className="flex justify-center items-center py-20"');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed wrapper in:', file);
      }
    }
  }
}

srcDirs.forEach(dir => processDir(dir));
console.log('Done fixing wrappers');
