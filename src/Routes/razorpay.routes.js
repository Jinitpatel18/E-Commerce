import express from 'express'
import { verifyToken } from '../Middleware/auth.middleware.js';
import { createRazorpayOrder, verifyPayment } from '../Controllers/razorpay.controller.js';

const router = express.Router()

router.post('/create-order/:orderId', verifyToken, createRazorpayOrder)
router.post('/verify', verifyToken, verifyPayment)

export default router;