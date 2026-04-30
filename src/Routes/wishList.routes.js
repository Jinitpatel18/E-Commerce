import express from 'express';
import { verifyRoles, verifyToken } from '../Middleware/auth.middleware.js';
import { getAllWishList, toggleWishList } from '../Controllers/wishList.controller.js';

const router = express.Router()

router.post('/:id', verifyToken, toggleWishList)
router.get('/', verifyToken, getAllWishList)

export default router;