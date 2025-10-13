// scripts/append_master_columns.js
// Usage: node scripts/append_master_columns.js path/to/products_prod.csv path/to/output.csv

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify/sync');

if (process.argv.length < 4) {
  console.error('Usage: node append_master_columns.js input.csv output.csv');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

// Master lists (match your DB master data)
const STYLES = ['Lẵng','Giỏ','Bó','Bình','Kệ','Hộp Hoa','Hoa Để Bàn','Hoa Cưới'];
const COLORS = ['Đỏ','Trắng','Vàng','Hồng','Cam','Tím','Xanh Lá','Kem','Đen'];
const OCCASIONS = ['Khai Trương','Sinh Nhật','Tang Lễ','Valentine','Cưới Hỏi','Chúc Mừng','Tân Gia','Kỷ Niệm','Cảm Ơn'];
const TAGS = ['Sang Trọng','Giá Rẻ','Hoa Tươi','Giao Hoa Tận Nơi','Thiết Kế Đẹp','Nhiều Lựa Chọn','Tặng Kèm Thiệp','Gói Quà','Hộp Sang Trọng'];

// Random helpers
function randInt(max) { return Math.floor(Math.random() * max); }
function pick(arr) { return arr[randInt(arr.length)]; }
function pickTags() {
  // pick 1-3 distinct tags, join by comma
  const n = 1 + randInt(3);
  const picked = new Set();
  while (picked.size < n) picked.add(pick(TAGS));
  return Array.from(picked).join(', ');
}

// Read CSV into memory (safe for files of moderate size)
async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
      .on('data', (data) => rows.push(data))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

(async () => {
  try {
    const rows = await readCsv(inputPath);
    if (!rows.length) {
      console.error('No rows found in input CSV.');
      process.exit(1);
    }

    // Determine headers and normalize names
    const origHeaders = Object.keys(rows[0]);
    // We want final headers:
    // name,sku,price,description,image,category,style,color,occasion,tags
    // Map possible existing headers: image or image -> image
    const finalHeaders = ['name','sku','price','description','image','category','style','color','occasion','tags'];

    const outRows = rows.map((r) => {
      const name = (r.name || r['Name'] || '').trim();
      const priceRaw = (r.price || r['price'] || r['Price'] || '').toString().trim();
      // keep numeric-ish price, remove dots/commas/spaces if present
      const price = priceRaw.replace(/[^\d.-]/g, '') || '';
      const description = (r.description || r['description'] || r['Description'] || '').trim();
      const image = (r.image || r.image || r['Image'] || '').trim();
      const category = (r.category || r['category'] || r['Category'] || '').trim();

      // Randomly assign master data but keep category as original
      const style = pick(STYLES);
      const color = pick(COLORS);
      const occasion = pick(OCCASIONS);
      const tags = pickTags();

      return {
        name,
        sku: '', // leave empty for now
        price,
        description,
        image,
        category,
        style,
        color,
        occasion,
        tags
      };
    });

    const csvOutput = stringify(outRows, { header: true, columns: finalHeaders });
    fs.writeFileSync(outputPath, csvOutput, 'utf8');
    console.log('Wrote output CSV to', outputPath);
  } catch (err) {
    console.error('Error:', err);
  }
})();
