const https = require('https');
const fs = require('fs');

const url = 'https://driffle.com/driffle-bronze-mystery-box-pc-steam-digital-code-p9884150';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/driffle_bronze.html', data);
    console.log('Saved bronze html, size:', data.length);
    const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      try {
        const json = JSON.parse(nextDataMatch[1]);
        const product = json?.props?.pageProps?.product?.data || json?.props?.pageProps?.product;
        console.log('Product Name:', product?.name);
        console.log('Cover image:', product?.coverImage);
        console.log('Cover image original:', product?.coverImageOriginal);
        console.log('All variations:', product?.allVariations ? product.allVariations.length : 'none');
        if (product?.allVariations) {
          console.log('Variations list:', product.allVariations.map(v => ({ name: v.name, sku: v.productSku, cover: v.coverImageOriginal || v.coverImage, slug: v.slug })));
        }
        fs.writeFileSync('scratch/bronze_product_data.json', JSON.stringify(product, null, 2));
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
      }
    }
  });
});

