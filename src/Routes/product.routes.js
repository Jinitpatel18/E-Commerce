import express from 'express';
import { verifyRoles, verifyToken } from '../Middleware/auth.middleware.js';
import { upload } from '../Middleware/multer.middleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProduct, getNewArrival, getSaleProduct, getSingleProduct, updateProduct } from '../Controllers/product.controller.js';

const router = express.Router()

router.post('/', verifyToken, verifyRoles("admin"), upload.array("images", 5), createProduct)
router.patch('/:id', verifyToken, verifyRoles("admin"), upload.array("images", 5), updateProduct)
router.delete('/:id', verifyToken, verifyRoles("admin"), deleteProduct)
router.get('/', getAllProducts);
router.get('/sales', getSaleProduct);
router.get('/new-arrival', getNewArrival);
router.get('/featured', getFeaturedProduct);
router.get('/:id', getSingleProduct);

export default router;