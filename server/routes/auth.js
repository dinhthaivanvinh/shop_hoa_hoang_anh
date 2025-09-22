const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const [[user]] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) return res.status(401).json({ error: 'Tài khoản không tồn tại' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Sai mật khẩu' });

  if (user.role !== 'admin') return res.status(403).json({ error: 'Không có quyền truy cập admin' });

  res.json({ message: 'Đăng nhập thành công', user: { id: user.id, username: user.username } });
});

module.exports = router;
