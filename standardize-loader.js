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
      let changed = false;

      // The target loader we want everywhere
      const loaderIcon = '<Loader2 className="w-12 h-12 text-blue-600 animate-spin" />';
      const loaderIconWithMb = '<Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />';

      // 1. Replace `<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>`
      const pattern1 = /<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"><\/div>/g;
      if (pattern1.test(content)) {
        content = content.replace(pattern1, loaderIcon);
        changed = true;
      }

      // 2. Replace `<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>`
      const pattern2 = /<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"><\/div>/g;
      if (pattern2.test(content)) {
        content = content.replace(pattern2, loaderIconWithMb);
        changed = true;
      }

      // 3. Replace `<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>`
      const pattern3 = /<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"><\/div>/g;
      if (pattern3.test(content)) {
        content = content.replace(pattern3, '<Loader2 className="w-16 h-16 text-blue-600 animate-spin" />');
        changed = true;
      }
      
      // 4. Hero.jsx loader
      const pattern4 = /<div className="w-16 h-16 border-4 border-white\/20 border-t-white rounded-full animate-spin"><\/div>/g;
      if (pattern4.test(content)) {
         content = content.replace(pattern4, '<Loader2 className="w-16 h-16 text-white animate-spin" />');
         changed = true;
      }

      // Add import if changed and not present
      if (changed) {
        if (!content.includes('Loader2')) {
          // If lucide-react is already imported
          if (content.includes("from 'lucide-react'")) {
            content = content.replace(/import \{(.*?)\} from 'lucide-react';/s, (match, p1) => {
              if (!p1.includes('Loader2')) {
                return `import {${p1}, Loader2} from 'lucide-react';`;
              }
              return match;
            });
          } else {
            // add to top
            content = `import { Loader2 } from 'lucide-react';\n` + content;
          }
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', file);
      }
    }
  }
}

srcDirs.forEach(dir => processDir(dir));
console.log('Done');
