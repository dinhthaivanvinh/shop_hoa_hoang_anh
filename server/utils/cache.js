const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // cache 10 phút
module.exports = cache;
