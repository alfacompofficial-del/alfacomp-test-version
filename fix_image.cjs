const https = require('https');

const SUPABASE_URL = 'https://iyiodwdadkcukhvlkwpb.supabase.co';
const PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aW9kd2RhZGtjdWtodmxrd3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTY5ODQsImV4cCI6MjA4NjM5Mjk4NH0.9cgazRPkilijI9Q3wtI7adF-teTH2ur1tgWOwyYfjkU';
const ADMIN_PASSWORD = 'Bilol2013/';

const targetName = 'LDT85-C012-KP01 White 17"-40" up to 12kg';
const newImageUrl = 'https://maxcom.uz/storage/product/FiFEVLA6kU8JQnhV8B5cG7Ox4SrRdst7a0dxnezN.jpeg'; // fallback or exact if we want

function fetchProducts() {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + '/rest/v1/products?select=*');
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': PUBLISHABLE_KEY,
        'Authorization': 'Bearer ' + PUBLISHABLE_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error('Status ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function adminAction(bodyObj) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(bodyObj);
    const url = new URL(SUPABASE_URL + '/functions/v1/admin-products');
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + PUBLISHABLE_KEY,
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error('Status ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function checkImage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) resolve(true);
      else resolve(false);
    }).on('error', () => resolve(false));
  });
}

async function main() {
  try {
    const baseObjUrl = 'https://maxcom.uz/storage/product/thumb/WUXMV4QR4Mkl1m4jVckpK7bxe5Gezb';
    let validUrl = baseObjUrl;
    
    if (await checkImage(baseObjUrl + '.jpeg')) validUrl += '.jpeg';
    else if (await checkImage(baseObjUrl + '.png')) validUrl += '.png';
    else if (await checkImage(baseObjUrl + '.jpg')) validUrl += '.jpg';
    
    console.log('Using valid image URL:', validUrl);

    console.log('Fetching products...');
    const products = await fetchProducts();
    const product = products.find(p => p.name === targetName);
    
    if (!product) {
      console.log('Product not found in database.');
      return;
    }

    console.log('Deleting old product:', product.id);
    await adminAction({ action: 'delete', password: ADMIN_PASSWORD, productId: product.id });
    
    console.log('Re-inserting with new image...');
    await adminAction({
      action: 'add',
      password: ADMIN_PASSWORD,
      product: {
        name: product.name,
        category: '\u041a\u0440\u043e\u043d\u0448\u0442\u0435\u0439\u043d\u044b',
        price: product.price,
        image: validUrl,
        brand: product.brand,
        in_stock: product.in_stock,
      }
    });
    
    console.log('Successfully updated product image.');
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

main();
