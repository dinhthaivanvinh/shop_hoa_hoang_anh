const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const db = require('../db');

exports.importCSV = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Không có file được tải lên.' });

    const csvData = fs.readFileSync(file.path, 'utf8');
    const parsed = Papa.parse(csvData, { header: true });
    const products = parsed.data;

    for (const p of products) {
      // 🔍 Tra category_id từ tên
      const [[categoryRow]] = await db.execute(
        'SELECT id FROM categories WHERE name = ?',
        [p.category]
      );

      if (!categoryRow) {
        console.warn(`⚠️ Không tìm thấy category: ${p.category}`);
        continue;
      }

      const category_id = categoryRow.id;
      console.log('🟢 Importing:', {
        name: p.name,
        category: p.category,
        category_id
      });

      await db.execute(
        'INSERT INTO products (name, price, description, image, category_id) VALUES (?, ?, ?, ?, ?)',
        [p.name, p.price, p.description, p.image, category_id]
      );
    }

    res.json({ message: 'Import thành công', count: products.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi import sản phẩm.' });
  }
};
