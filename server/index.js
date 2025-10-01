const express = require('express');
const cors = require('cors');

const productsRoutes = require('./routes/products');
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
});

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

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

