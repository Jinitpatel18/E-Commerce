import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    sizes: [{
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12", "13", "14"]
    }],
    colors: [{
        type: String,
    }],
    category: {
        type: String,
        enum: ["Clothing", "Footwear", "Accessories", "Outerwear"],
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    newArrival: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isSale: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    numReview: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Product = model("Product", productSchema)
export default Product;