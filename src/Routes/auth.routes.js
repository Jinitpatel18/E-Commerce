import express from 'express'
import { loginUser, logOutUser, registerUser } from '../Controllers/user.controller.js'
import { authLimiter } from '../Utils/rateLimits.js'
import { verifyToken } from '../Middleware/auth.middleware.js'
const router = express.Router()

router.post('/register',authLimiter, registerUser)
router.post('/login',authLimiter, loginUser)
router.post('/logout', verifyToken, logOutUser)

export default router