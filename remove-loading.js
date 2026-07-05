const fs = require('fs');
const path = require('path');

function removeLoadingBlock(content) {
  // First case: single line if (loading) return ...
  content = content.replace(/^[ \t]*if \(loading\)[ \t]*return[^\n]+;\n/gm, '');

  // Second case: multiline if (loading) { ... }
  let startIndex;
  while ((startIndex = content.indexOf('if (loading) {')) !== -1) {
    let openBraces = 0;
    let i = startIndex + 'if (loading) {'.length;
    openBraces = 1;
    
    // Find the matching closing brace
    while (i < content.length && openBraces > 0) {
      if (content[i] === '{') openBraces++;
      if (content[i] === '}') openBraces--;
      i++;
    }
    
    // Remove the block, and the following newline if present
    let endIndex = i;
    if (content[endIndex] === '\n') endIndex++;
    
    // Look backwards to remove the indentation spaces
    let startRemove = startIndex;
    while (startRemove > 0 && (content[startRemove - 1] === ' ' || content[startRemove - 1] === '\t')) {
      startRemove--;
    }
    
    content = content.substring(0, startRemove) + content.substring(endIndex);
  }
  return content;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = removeLoadingBlock(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'forntend', 'src', 'components'));
processDirectory(path.join(__dirname, 'forntend', 'src', 'pages'));

console.log('Done!');
