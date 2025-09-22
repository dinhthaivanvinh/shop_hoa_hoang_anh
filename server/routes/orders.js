const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { customer_name, phone, address, note, items } = req.body;

  if (!customer_name || !phone || !address || !note || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Thiếu thông tin đơn hàng hoặc giỏ hàng trống' });
  }

  try {
    let total_price = 0;

    for (const item of items) {
      const [[product]] = await db.execute('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (!product) return res.status(400).json({ error: 'Sản phẩm không tồn tại' });
      total_price += product.price * item.quantity;
    }

    const [orderResult] = await db.execute(
      'INSERT INTO orders (customer_name, phone, address, note, total_price) VALUES (?, ?, ?, ?, ?)',
      [customer_name, phone, address, note, total_price]
    );

    const order_id = orderResult.insertId;

    for (const item of items) {
      const [[product]] = await db.execute('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, product.price]
      );
    }

    res.json({ message: 'Đặt hàng thành công', order_id });
  } catch (err) {
    console.error('❌ Lỗi khi tạo đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server khi xử lý đơn hàng' });
  }
});

module.exports = router;