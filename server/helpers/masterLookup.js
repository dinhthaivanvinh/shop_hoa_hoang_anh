// utils/masterLookup.js
const db = require('../db');

function normalizeName(s) {
  if (!s) return '';
  return s.toString().trim().replace(/\s+/g, ' ').toLowerCase();
}

async function preloadMasters() {
  const masters = {};
  const queries = {
    categories: 'SELECT id, name FROM categories',
    styles: 'SELECT id, name FROM styles',
    colors: 'SELECT id, name FROM colors',
    occasions: 'SELECT id, name FROM occasions',
    tags: 'SELECT id, name FROM tags'
  };

  await Promise.all(Object.keys(queries).map(async (key) => {
    const [rows] = await db.execute(queries[key]);
    const map = new Map();
    for (const r of rows) {
      map.set(normalizeName(r.name), r.id);
    }
    masters[key] = map;
  }));

  return { masters, normalizeName };
}

module.exports = { preloadMasters, normalizeName };
