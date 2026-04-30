import User from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import bcrypt from 'bcrypt'

const options = {
    httpOnly: true,   // JS can't access it (protects from XSS)
    secure: true,     // only HTTPS (set false in local dev if needed)
    sameSite: "strict" // CSRF protection
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullname, role, phone } = req.body;
    if (!username || !email || !password || !fullname) {
        throw new ApiError(400, "Username, email, password, and fullname are required fields.")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "A user already exists with that username or email.")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        username,
        email,
        password: hashPassword,
        fullname,
        role,
        phone,
    })

    const { password: _, ...safeUser } = user.toObject()

    return res.status(201).json(
        new ApiResponse(201, true, "User registered successfully.", safeUser)
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ((!email && !username) || !password) {
        throw new ApiError(400, "Email or username and password are required.")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    }).select("+password")

    if (!user) {
        throw new ApiError(404, "User not found with this email or username.")
    }

    const isMatch = await user.isPasswordValid(password)
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials.")
    }

    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    const { password: _p, refreshToken: _r, ...safeUser } = user.toObject()

    res.cookie("refreshToken", refreshToken, options)
    return res.status(200).json(new ApiResponse(200, true, "Login successfully!!", {safeUser, accessToken}))
})

const logOutUser = asyncHandler(async(req, res) => {
    const { _id } = req.user;

    const user = await User.findById(_id).select("+refreshToken")

    user.refreshToken = null
    await user.save({ validateBeforeSave: false})
    return res.status(200).clearCookie("refreshToken", options).json(new ApiResponse(200, true, "Logout successfully!!", null))
})

export { registerUser, loginUser, logOutUser }