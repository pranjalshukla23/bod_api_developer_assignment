import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // 10 requests per 5 mins
  standardHeaders: true,
  legacyHeaders: false,
});
