const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20
});

module.exports = limiter;
