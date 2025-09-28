const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { importCSV } = require('../controllers/productsController');
const db = require('../db');
const validatePagination = require('../middlewares/validatePagination');

router.post('/import', upload.single('file'), importCSV);

router.get('/category', validatePagination, async (req, res) => {
  try {
    const { type = 'KhaiTruong', name, minPrice, maxPrice } = req.query;
    const { page, limit, offset } = req.pagination;

    // Xây dựng điều kiện lọc
    let whereClause = 'WHERE c.name = ?';
    const params = [type];

    if (name) {
      whereClause += ' AND p.name LIKE ?';
      params.push(`%${name}%`);
    }

    if (minPrice) {
      whereClause += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      whereClause += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    // Truy vấn tổng số sản phẩm
    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total
       FROM products p
       JOIN categories c ON p.category_id = c.id
       ${whereClause}`,
      params
    );

    if (offset >= total) {
      return res.json({
        products: [],
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    }

    // Truy vấn sản phẩm có phân trang
    const sql = `
      SELECT 
        p.id, p.name, p.price, p.description, p.image,
        c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await db.execute(sql, params);

    res.json({
      products: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('🔥 Lỗi truy vấn có lọc:', err);
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo loại và bộ lọc' });
  }
});

router.get('/home', async (req, res) => {
  try {
    const categories = ['KhaiTruong', 'SinhNhat', 'TangLe'];
    const result = {};

    for (const type of categories) {
      const sql = `
        SELECT 
          p.id, p.name, p.price, p.description, p.image,
          c.name AS category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE c.name = ?
        ORDER BY p.created_at DESC
        LIMIT 10
      `;
      const [rows] = await db.execute(sql, [type]);
      result[type] = rows;
    }

    res.json(result);
  } catch (err) {
    console.error('🔥 Lỗi khi lấy sản phẩm cho trang Home:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy sản phẩm trang chủ' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [[product]] = await db.execute(
      `SELECT p.id, p.name, p.price, p.description, p.image, c.name AS category
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    console.error('🔥 Lỗi lấy chi tiết sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
