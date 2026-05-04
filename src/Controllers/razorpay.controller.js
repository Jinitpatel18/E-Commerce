import razorpay from "../Utils/razorpay.js";
import Order from "../Models/order.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import crypto from 'crypto';

const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found!!")
    }

    if (order.paymentStatus === "paid") {
        return res.status(200).json(
            new ApiResponse(200, true, "Order already paid!!")
        )
    }

    const razorpayOrder = await razorpay.orders.create({
        amount: order.totalPrice * 100,
        currency: "INR",
        receipt: `order_${orderId}`
    })

    return res.status(200).json(
        new ApiResponse(200, true, "Razorpay order successfully!!", {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        })
    )
})

const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex")

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed!!")
    }

    const order = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentId: razorpay_order_id,
        status: 'processing'
    }, { returnDocument: 'after' })

    return res.status(200).json(
        new ApiResponse(200, true, "payment verify successfully!!", order)
    )
})

export { createRazorpayOrder, verifyPayment }