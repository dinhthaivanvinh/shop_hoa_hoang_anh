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

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let query = 'SELECT * FROM orders';
  let countQuery = 'SELECT COUNT(*) AS count FROM orders';
  const params = [];

  if (status) {
    query += ' WHERE status = ?';
    countQuery += ' WHERE status = ?';
    params.push(status);
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  try {
    const [orders] = await db.query(query, params);
    const [[{ count }]] = await db.query(countQuery, status ? [status] : []);

    res.json({
      orders: orders?.map(toCamelCase),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.put('/:id/status', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'shipped', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công', status });
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    // Lấy thông tin đơn hàng
    const [orderRows] = await db.query(
      'SELECT id, customer_name, phone, address, note, total_price, status, created_at FROM orders WHERE id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    const order = orderRows[0];

    // Lấy danh sách sản phẩm trong đơn hàng
    const [items] = await db.query(
      `SELECT p.name, oi.quantity, oi.price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // Trả về dữ liệu
    res.json({
      id: order.id,
      customerName: order.customer_name,
      phone: order.phone,
      address: order.address,
      note: order.note,
      totalPrice: order.total_price,
      status: order.status,
      createdAt: order.created_at,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

const toCamelCase = (obj) => {
  const newObj = {};
  for (let key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
};


module.exports = router;