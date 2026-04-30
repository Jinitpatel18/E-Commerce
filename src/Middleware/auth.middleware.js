import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';
import { ApiError } from '../Utils/ApiError.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized!! No token available!!",
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: " Unauthorized!! Invalid token!!"
            })
        }
        req.user = user;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid token!!",
            error: error.message
        })
    }
}

const verifyRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "UnAuthorized!! No user information available!!");
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden!! You don't have permission to access this resource!!")
        }
        next();
    }
}

export { verifyToken, verifyRoles };