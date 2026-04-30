import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        default: ""
    },
    color: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    }
})

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["unPaid", "paid", "refunded"],
        default: "unPaid"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },
    paymentId: {
        type: String,
        default: ""
    }
},{
    timestamps: true
})

const Order = model("Order", orderSchema)
export default Order;