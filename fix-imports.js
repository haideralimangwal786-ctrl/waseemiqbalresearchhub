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

      // Check if Loader2 is used but not imported
      if (content.includes('<Loader2') && !content.includes('Loader2} from') && !content.includes('Loader2 } from') && !content.includes('import { Loader2 }')) {
        
        if (content.includes("from 'lucide-react'")) {
          content = content.replace(/import \{(.*?)\} from 'lucide-react';/s, (match, p1) => {
             return `import {${p1}, Loader2} from 'lucide-react';`;
          });
        } else {
          content = `import { Loader2 } from 'lucide-react';\n` + content;
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed imports:', file);
      }
    }
  }
}

srcDirs.forEach(dir => processDir(dir));
console.log('Done fixing imports');
