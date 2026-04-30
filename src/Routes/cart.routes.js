import express from 'express'
import { addToCart, clearCart, getCart, removeItemFromCart, updateQuantity } from '../Controllers/cart.controller.js';
import { verifyToken } from '../Middleware/auth.middleware.js';

const router = express.Router()

router.post('/add', verifyToken, addToCart)
router.get('/', verifyToken, getCart)
router.patch('/update/:itemId', verifyToken, updateQuantity)
router.delete('/remove/:itemId', verifyToken, removeItemFromCart)
router.delete('/clear', verifyToken, clearCart)

export default router;