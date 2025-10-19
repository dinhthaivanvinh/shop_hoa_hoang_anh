// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const cache = require('../utils/cache');
const { buildFilters } = require('../helpers/filterHelpers');
const csv = require('csv-parser');
const multer = require('multer');
const upload = multer({ dest: '/tmp' }); // chỉ dùng để đọc uploaded CSV

// Helper: cache invalidation (gọi khi tạo/sửa/xóa sản phẩm)
function invalidateProductCaches(productId) {
  cache.del('home:products');
  cache.del('filters:all');
  cache.del(`product:${productId}`);
  // nếu dùng pattern-based invalidation, lặp qua keys hoặc dùng Redis
}

/**
 * GET /api/products
 * Query params: page, limit, name, minPrice, maxPrice, category_id, style_id, color_id, occasion_id
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    // build cache key
    // const cacheKey = `products:${page}:${limit}:${req.query.name || ''}:${req.query.minPrice || ''}:${req.query.maxPrice || ''}:${req.query.category_id || ''}:${req.query.style_id || ''}:${req.query.color_id || ''}:${req.query.occasion_id || ''}`;
    // const cached = cache.get(cacheKey);
    // if (cached) return res.json(cached);

    const { where, params } = buildFilters(req.query);

    // total count
    const countSql = `
      SELECT COUNT(*) AS total
      FROM products p
      ${where}
    `;
    const [[{ total }]] = await db.execute(countSql, params);

    // if no results
    if (offset >= total) {
      const emptyResponse = { products: [], total, page, totalPages: Math.ceil(total / limit) };
      cache.set(cacheKey, emptyResponse);
      return res.json(emptyResponse);
    }

    // data query with joins to get names
    const dataSql = `
      SELECT 
        p.id, p.name, p.sku, p.price, p.description, p.image,
        c.name AS category, s.name AS style, col.name AS color, o.name AS occasion
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN styles s ON p.style_id = s.id
      LEFT JOIN colors col ON p.color_id = col.id
      LEFT JOIN occasions o ON p.occasion_id = o.id
      ${where}
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = params.concat([limit, offset]);
    const [rows] = await db.execute(dataSql, dataParams);

    const response = { products: rows, total, page, totalPages: Math.ceil(total / limit) };
    // cache.set(cacheKey, response);
    return res.json(response);
  } catch (err) {
    console.error('🔥 GET /api/products error:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

const removeDiacritics = require('diacritics').remove;

const slugify = (str) => {
  return removeDiacritics(str)
    .toLowerCase()
    .replace(/\s+/g, '-') // khoảng trắng → gạch ngang
    .replace(/[^\w-]/g, ''); // bỏ ký tự đặc biệt
};


/**
 * GET /api/products/home
 * returns object keyed by category name -> array of products (limit 10 each)
 */
// Backend API - routes/products.js (hoặc tương tự)

router.get('/home', async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query;

    const result = {};

    console.log('🔍 Truy vấn danh mục có sản phẩm...');
    console.log('📊 Filters:', { name, minPrice, maxPrice });

    // Lấy danh sách categories có sản phẩm
    const [categories] = await db.execute(`
      SELECT DISTINCT p.category_id, c.name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `);

    console.log('📦 Danh mục:', categories);

    // Với mỗi danh mục, lấy sản phẩm có filter
    await Promise.all(categories.map(async ({ category_id, name: categoryName }) => {
      const slug = slugify(categoryName);

      // Build dynamic WHERE clause
      let whereConditions = ['category_id = ?'];
      let queryParams = [category_id];

      // Filter by name
      if (name) {
        whereConditions.push('name LIKE ?');
        queryParams.push(`%${name}%`);
      }

      // Filter by minPrice
      if (minPrice) {
        whereConditions.push('price >= ?');
        queryParams.push(parseFloat(minPrice));
      }

      // Filter by maxPrice
      if (maxPrice) {
        whereConditions.push('price <= ?');
        queryParams.push(parseFloat(maxPrice));
      }

      const whereClause = whereConditions.join(' AND ');

      const query = `
        SELECT id, name, price, image
        FROM products
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT 10
      `;

      const [products] = await db.execute(query, queryParams);

      // Chỉ thêm vào result nếu có sản phẩm
      if (products.length > 0) {
        result[slug] = {
          label: categoryName,
          products
        };
      }
    }));

    console.log('✅ Kết quả:', Object.keys(result).length, 'categories');

    res.json(result);

  } catch (err) {
    console.error('🔥 Lỗi khi lấy sản phẩm trang chủ:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy sản phẩm trang chủ' });
  }
});

/**
 * GET /api/products/filters
 * returns lists for categories, styles, colors, occasions, tags
 */
router.get('/filters', async (req, res) => {
  try {
    const cacheKey = 'filters:all';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const [categories] = await db.execute('SELECT id, name FROM categories ORDER BY name');
    const [styles] = await db.execute('SELECT id, name FROM styles ORDER BY name');
    const [colors] = await db.execute('SELECT id, name FROM colors ORDER BY name');
    const [occasions] = await db.execute('SELECT id, name FROM occasions ORDER BY name');
    const [tags] = await db.execute('SELECT id, name FROM tags ORDER BY name');

    const response = { categories, styles, colors, occasions, tags };
    cache.set(cacheKey, response);
    res.json(response);
  } catch (err) {
    console.error('🔥 GET /api/products/filters error:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy bộ lọc' });
  }
});



// routes/products.js (đoạn import CSV) - sử dụng preloadMasters
const { preloadMasters, normalizeName } = require('../helpers/masterLookup');

router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Vui lòng gửi file CSV' });

  const filePath = req.file.path;
  const created = [];
  const warnings = [];

  const stream = require('fs').createReadStream(filePath)
    .pipe(csv({ skipLines: 0, mapHeaders: ({ header }) => header.trim() }));

  const connection = await db.getConnection();
  try {
    // preload master data once
    const { masters, normalizeName } = await preloadMasters();
    await connection.beginTransaction();

    for await (const row of stream) {
      const name = (row.name || '').trim();
      if (!name) {
        warnings.push({ row, reason: 'Missing name' });
        continue;
      }

      const sku = (row.sku || '').trim() || null;
      const price = parseFloat((row.price || '0').replace(/[^\d.-]/g, '')) || 0;
      const description = row.description || null;
      const image = (row.image || row.image || '').trim() || null;

      // lookup master ids by normalized name
      const catName = normalizeName(row.category);
      const styleName = normalizeName(row.style);
      const colorName = normalizeName(row.color);
      const occName = normalizeName(row.occasion);

      const category_id = masters.categories.get(catName) || null;
      const style_id = masters.styles.get(styleName) || null;
      const color_id = masters.colors.get(colorName) || null;
      const occasion_id = masters.occasions.get(occName) || null;

      if (!category_id && catName) warnings.push({ row: name, field: 'category', value: row.category, reason: 'Not found in master data' });
      if (!style_id && styleName) warnings.push({ row: name, field: 'style', value: row.style, reason: 'Not found in master data' });
      if (!color_id && colorName) warnings.push({ row: name, field: 'color', value: row.color, reason: 'Not found in master data' });
      if (!occasion_id && occName) warnings.push({ row: name, field: 'occasion', value: row.occasion, reason: 'Not found in master data' });

      // insert product
      const insertSql = `
        INSERT INTO products
          (name, sku, price, description, image, category_id, style_id, color_id, occasion_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const [insertRes] = await connection.execute(insertSql, [name, sku, price, description, image, category_id, style_id, color_id, occasion_id]);
      const productId = insertRes.insertId;

      // tags handling: default = skip missing tags; optionally autoCreateTags = true to create new tag rows
      const tagsCsv = (row.tags || '').trim();
      const autoCreateTags = false; // change to true if you want auto-create
      if (tagsCsv) {
        const tagsArr = tagsCsv.split(',').map(t => t.trim()).filter(Boolean);
        for (const tagNameRaw of tagsArr) {
          const tagName = normalizeName(tagNameRaw);
          let tagId = masters.tags.get(tagName);

          if (!tagId && autoCreateTags) {
            const [tIns] = await connection.execute('INSERT INTO tags (name) VALUES (?)', [tagNameRaw.trim()]);
            tagId = tIns.insertId;
            // update in-memory masters to avoid duplicate insert
            masters.tags.set(tagName, tagId);
          }

          if (tagId) {
            await connection.execute('INSERT IGNORE INTO products_tags (product_id, tag_id) VALUES (?, ?)', [productId, tagId]);
          } else {
            warnings.push({ row: name, field: 'tag', value: tagNameRaw, reason: 'Tag not found' });
          }
        }
      }

      created.push({ id: productId, name });
    }

    await connection.commit();
    // invalidate caches (implement function as earlier)
    invalidateProductCaches();
    res.json({ createdCount: created.length, created, warnings });
  } catch (err) {
    await connection.rollback();
    console.error('🔥 Import error:', err);
    res.status(500).json({ error: 'Lỗi khi import CSV' });
  } finally {
    connection.release();
    require('fs').unlink(filePath, () => { });
  }
});

router.get('/category', async (req, res) => {
  try {
    const { type, name, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    if (!type) return res.status(400).json({ error: 'Thiếu type trong query' });

    const normalizedType = slugify(type, { lower: true });

    const [categories] = await db.execute('SELECT id, name FROM categories');

    const matched = categories.find(c => slugify(c.name, { lower: true }) === normalizedType);
    if (!matched) {
      console.warn('❌ Không tìm thấy danh mục:', normalizedType);
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }

    const category_id = matched.id;

    // Xây dựng điều kiện lọc
    let where = 'WHERE category_id = ?';
    const params = [category_id];

    if (name) {
      where += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    if (minPrice) {
      where += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      where += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    // Đếm tổng số sản phẩm
    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM products ${where}`,
      params
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Lấy sản phẩm phân trang
    const sql = `
      SELECT id, name, price, image
      FROM products
      ${where}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [products] = await db.execute(sql, params);


    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image
    }));

    res.json({ products: formatted, totalPages });
  } catch (err) {
    console.error('🔥 Lỗi GET /category:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy sản phẩm theo danh mục' });
  }
});

module.exports = router;


/**
 * GET /api/products/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `product:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const sql = `
      SELECT p.id, p.name, p.sku, p.price, p.description, p.image,
             c.name AS category, s.name AS style, col.name AS color, o.name AS occasion
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN styles s ON p.style_id = s.id
      LEFT JOIN colors col ON p.color_id = col.id
      LEFT JOIN occasions o ON p.occasion_id = o.id
      WHERE p.id = ?
      LIMIT 1
    `;
    const [[product]] = await db.execute(sql, [id]);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

    // tags
    const [tags] = await db.execute(
      `SELECT t.id, t.name FROM tags t
       JOIN products_tags pt ON pt.tag_id = t.id
       WHERE pt.product_id = ?`, [id]
    );
    product.tags = tags || [];

    cache.set(cacheKey, product);
    res.json(product);
  } catch (err) {
    console.error('🔥 GET /api/products/:id error:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết sản phẩm' });
  }
});

module.exports = router;
