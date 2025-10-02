const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // cache 5 phút
module.exports = cache;
