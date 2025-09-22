const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/products');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const authRoutes = require('./routes/auth');

app.use(express.json()); // cần để đọc req.body
app.use('/api', authRoutes); // ✅ mount đúng prefix

