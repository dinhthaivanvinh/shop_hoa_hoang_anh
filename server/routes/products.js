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
    const { type = 'KhaiTruong' } = req.query;
    const { page, limit, offset } = req.pagination;

    // Truy vấn tổng số sản phẩm trước
    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE c.name = ?`,
      [type]
    );

    // ✅ Fallback nếu offset vượt quá tổng
    if (offset >= total) {
      return res.json({
        products: [],
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    }

    // Truy vấn sản phẩm
    const sql = `
      SELECT 
        p.id, p.name, p.price, p.description, p.image,
        c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.name = ?
      ORDER BY p.id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await db.execute(sql, [type]);

    res.json({
      products: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('🔥 Lỗi truy vấn JOIN:', err);
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo loại' });
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


module.exports = router;
