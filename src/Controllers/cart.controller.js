import Cart from "../Models/cart.model.js";
import Product from "../Models/product.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, size, color } = req.body;

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "Product not found with this id!!")
    }

    let cart = await Cart.findOne({ user: req.user._id })
    if (cart) {
        const existingItem = await cart.items.find(item => item.product.toString() === productId)
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({
                product: productId,
                quantity,
                size,
                color,
                price: product.price
            })
        }
    } else {
        cart = await Cart.create({
            user: req.user._id,
            items: [{
                product: productId,
                quantity,
                size,
                color,
                price: product.price
            }],
            totalPrice: product.price * quantity
        })
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)

    await cart.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, true, "Product add in cart successfully", cart))
})

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name image price")

    if (!cart) {
        return res.status(404).json(
            new ApiResponse(404, false, "Cart is not found!!", { items: [], totalPrice: 0 })
        )
    }

    return res.status(200).json(
        new ApiResponse(200, true, "Cart fetch successfully!!", cart)
    )
})

const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, true, "Clear cart successfully!!", cart)
    )
})

const removeItemFromCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        throw new ApiError(404, "Cart not found!!")
    }

    cart.items = cart.items.filter(item => item._id.tpString() !== itemId)

    cart.totalPrice = cart.items.reduce((item, total) => {
        return total + (item.price * item.quantity);
    }, 0)

    await cart.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, true, "Item remove successfully!!", cart)
    )
})

const updateQuantity = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        throw new ApiError(404, "Cart not found!!")
    }

    const item = cart.items.find(item => item._id.toString() === itemId)
    if (item) {
        item.quantity = quantity;
    } else {
        throw new ApiError(404, "Item is not available in cart!!")
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0)

    await cart.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, true, "Update quantity successfully!!", cart)
    )
})

export { addToCart, getCart, clearCart, removeItemFromCart, updateQuantity }