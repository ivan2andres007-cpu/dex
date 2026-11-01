const fs = require('fs');

const txt = fs.readFileSync('C:/Users/Portfolio/.gemini/antigravity-ide/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a/.system_generated/steps/216/content.md', 'utf8');

const sIdx = txt.lastIndexOf('"tag":"Roblox');
console.log(txt.slice(sIdx + 1500, sIdx + 3500));
