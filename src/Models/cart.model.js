import { Schema, model } from "mongoose";

const cartItemsSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12", "13", "14"],
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

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
        unique: true
    },
    items: [cartItemsSchema],
    totalPrice: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

const Cart = model("Cart", cartSchema)
export default Cart;
