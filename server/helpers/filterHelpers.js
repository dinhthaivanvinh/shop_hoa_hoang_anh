// helpers/filterHelpers.js
// Hữu ích để build dynamic WHERE và params an toàn
function buildFilters({ name, minPrice, maxPrice, category_id, style_id, color_id, occasion_id }) {
  const clauses = [];
  const params = [];

  if (category_id) {
    clauses.push('p.category_id = ?');
    params.push(category_id);
  }
  if (style_id) {
    clauses.push('p.style_id = ?');
    params.push(style_id);
  }
  if (color_id) {
    clauses.push('p.color_id = ?');
    params.push(color_id);
  }
  if (occasion_id) {
    clauses.push('p.occasion_id = ?');
    params.push(occasion_id);
  }
  if (name) {
    clauses.push('p.name LIKE ?');
    params.push(`%${name}%`);
  }
  if (minPrice) {
    clauses.push('p.price >= ?');
    params.push(minPrice);
  }
  if (maxPrice) {
    clauses.push('p.price <= ?');
    params.push(maxPrice);
  }

  const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
  return { where, params };
}

module.exports = { buildFilters };
