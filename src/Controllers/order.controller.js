import Order from "../Models/order.model.js";
import Cart from "../Models/cart.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        throw new ApiError(404, "Cart not found!!")
    }

    if (cart.items.length === 0) {
        throw new ApiError(404, "Cart is empty!!")
    }

    const order = await Order.create({
        user: req.user._id,
        items: cart.items,
        totalPrice: cart.totalPrice,
        shippingAddress,
        paymentMethod
    })

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save({ validateBeforeSave: false })

    return res.status(201).json(
        new ApiResponse(201, true, "Order created successfully!!", order)
    )
})

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate("items.product", "name image price").sort({ createdAt: -1 })

    if (!orders || orders.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, true, "No orders found!!", [])
        )
    }

    return res.status(200).json(
        new ApiResponse(200, true, "Orders fetch successfully!!", orders)
    )
})

const getSingleOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "order not found!!")
    }

    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "User not match with orderId!!")
    }

    return res.status(200).json(
        new ApiResponse(200, true, "Order fetch successfully!!", order)
    )
})

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id)

    if (!order) {
        throw new ApiError(404, "Order not  found!!")
    }

    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "UnAuthorized!!")
    }
    if (order.status === "delivered") {
        throw new ApiError(400, "You can not cancel this order because this order placed successfully!!")
    }

    if (order.status === "cancelled") {
        throw new ApiError(400, "This is already cancelled order!!")
    }

    order.status = "cancelled";
    await order.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, true, "Cancelled order successfully!!", null)
    )
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id)

    if (!order) {
        throw new ApiError(404, "Order not found!!")
    }

    const validStatus = ["pending", "processing", "shipped", "delivered", "cancelled"]

    if (!validStatus.includes(status)) {
        throw new ApiError(400, "Invalid status!!")
    }

    order.status = status;

    await order.save({ validateBeforeSave: false });
    return res.status(200).json(
        new ApiResponse(200, true, "Updated order status successfully!!", { newStatus: order.status })
    )
})

export { createOrder, getOrders, getSingleOrder, cancelOrder, updateOrderStatus };