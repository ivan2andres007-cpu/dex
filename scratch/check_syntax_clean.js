const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Test JSON-LD scripts
const jsonLdMatches = [...html.matchAll(/<script\s+type=['"]application\/ld\+json['"]>([\s\S]*?)<\/script>/gi)];
jsonLdMatches.forEach((m, i) => {
  try {
    const parsed = JSON.parse(m[1]);
    console.log(`JSON-LD Script ${i}: Valid JSON (${parsed['@type']})`);
  } catch(e) {
    console.error('JSON-LD error:', e.message);
    process.exit(1);
  }
});

// Test JS scripts
const jsMatches = [...html.matchAll(/<script(?![^>]*(?:src=|application\/ld\+json))[^>]*>([\s\S]*?)<\/script>/gi)];
jsMatches.forEach((m, i) => {
  try {
    new Function(m[1]);
    console.log(`JS Script ${i}: Valid JavaScript (Length: ${m[1].length} chars)`);
  } catch(e) {
    console.error(`JS Script ${i} error:`, e.message);
    process.exit(1);
  }
});

console.log('ALL SCRIPTS SYNTACTICALLY VALID AND PARSED!');
