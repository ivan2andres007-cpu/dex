const https = require('https');

// Let's search using driffle search endpoint
const query = '1 Random Steam Game';
const url = `https://driffle.com/api/v1/search?query=${encodeURIComponent(query)}&page=1&limit=20`;

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Search status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Search results count:', json?.data?.length || json?.products?.length || 'none');
      console.log('Search response keys:', Object.keys(json));
      if (json.data) {
        json.data.forEach(p => console.log(p.name, p.slug));
      }
    } catch(e) {
      console.log('Error or HTML response:', data.slice(0, 200));
    }
  });
});

