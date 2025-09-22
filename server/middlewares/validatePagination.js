module.exports = (req, res, next) => {
  let { page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({ error: 'Tham số page không hợp lệ' });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'Tham số limit không hợp lệ' });
  }

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };

  next();
};
