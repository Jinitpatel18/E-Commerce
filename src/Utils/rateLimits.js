import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: process.env.NODE_ENV === "production" ? 100 : 1000,
    // Production → 100, Development → 1000
    message: {
        success: false,
        message: "Too many requests!! Try again after 15 minutes!!"
    }
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 10 : 100,
    // Production → 10, Development → 100
    message: {
        success: false,
        message: "Too many attempts!! Try again after 15 minutes!!"
    }
})