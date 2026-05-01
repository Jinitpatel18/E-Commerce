import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import express from 'express';
import { errorMiddleware } from './Utils/errorMiddleware.js';
import ProductRoutes from './Routes/product.routes.js'
import authRoutes from './Routes/auth.routes.js'
import { limiter } from './Utils/rateLimits.js';
import cartRoutes from './Routes/cart.routes.js';
import orderRoutes from './Routes/order.routes.js';
import wishListRoutes from './Routes/wishList.routes.js';
import paymentRoutes from './Routes/razorpay.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173',
        'https://tera-frontend.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "J&M E-Commerce API is running! 🚀",
        version: "1.0.0"
    })
})


app.use('/api/v1/products', ProductRoutes)
app.use('/api/v1/users', authRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/wish-list', wishListRoutes)
app.use('/api/v1/payment', paymentRoutes)

app.use(errorMiddleware);
export default app;