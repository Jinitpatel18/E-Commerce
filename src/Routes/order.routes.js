import express from 'express';
import { cancelOrder, createOrder, getOrders, getSingleOrder, updateOrderStatus } from '../Controllers/order.controller.js';
import { verifyRoles, verifyToken } from '../Middleware/auth.middleware.js';

const router = express.Router()

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getSingleOrder);
router.patch('/cancel/:id', verifyToken, cancelOrder)
router.patch('/status/:id', verifyToken, verifyRoles("admin"), updateOrderStatus);

export default router;