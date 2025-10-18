const express = require('express');
const cors = require('cors');

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
});

const app = express();
app.use((req, res, next) => {
  console.log(`📥 [${req.method}] ${req.originalUrl}`);
  next();
});
app.use((err, req, res, next) => {
  console.error('💥 Lỗi toàn cục:', err.stack);
  res.status(500).json({ error: 'Lỗi server nội bộ' });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// giả sử validatePagination được mount ở route /api/products
const validatePagination = (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
};

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on', PORT));


const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const authRoutes = require('./routes/auth');

app.use(express.json()); // cần để đọc req.body
app.use('/api', authRoutes); // ✅ mount đúng prefix
