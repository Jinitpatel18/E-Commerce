import Product from "../Models/product.model.js";
import { asyncHandler } from '../Utils/asyncHandler.js'
import { ApiError } from '../Utils/ApiError.js'
import { ApiResponse } from '../Utils/ApiResponse.js'
import { deleteFromCloudinary, uploadToCloudinary } from "../Utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, sizes, discountPrice, isSale, isFeatured, newArrival, price, category, colors, stock } = req.body;
    const imageFiles = req.files

    if (!name || !description || !price || !category) {
        throw new ApiError(400, 'Name, Description, Price and Category is required fields!!')
    }

    const uploadImages = await Promise.all(imageFiles.map((image) => uploadToCloudinary(image.path)))
    const imageUrls = uploadImages.filter(img => img !== null).map(img => img.secure_url)

    const product = await Product.create({
        name,
        description,
        price,
        images: imageUrls,
        category,
        sizes: sizes || [],
        colors: colors || [],
        discountPrice: discountPrice || 0,
        stock: stock || 0,
        newArrival: newArrival || false,
        isFeatured: isFeatured || false,
        isSale: isSale || false
    })

    return res.status(201).json(
        new ApiResponse(201, true, 'ProductDetails created successfully!!', product)
    )
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, sizes, discountPrice, isSale, isFeatured, newArrival, price, category, colors, stock } = req.body;
    const product = await Product.findById(id)
    if (!product) {
        throw new ApiError(404, "Product is not available in DB with this id.")
    }
    const updateFields = {}

    if (name) {
        updateFields.name = name
    }
    if (description) {
        updateFields.description = description
    }
    if (discountPrice) {
        updateFields.discountPrice = discountPrice
    }
    if (price) {
        updateFields.price = price
    }
    if (newArrival !== undefined) {
        updateFields.newArrival = newArrival
    }
    if (isSale !== undefined) {
        updateFields.isSale = isSale
    }
    if (isFeatured !== undefined) {
        updateFields.isFeatured = isFeatured
    }
    if (stock) {
        updateFields.stock = stock
    }
    if (colors) {
        updateFields.colors = colors
    }
    if (category) {
        updateFields.category = category
    }
    if (sizes) {
        updateFields.sizes = sizes
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { returnDocument: 'after' })
    return res.status(200).json(new ApiResponse(200, true, "Product updated successfully!!", updatedProduct))
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) {
        throw new ApiError(404, "Product is not available with this id.")
    }

    if (product.images.length > 0) {
        await Promise.all(
            product.images.map(image => deleteFromCloudinary(image))
        )
    }

    const deletedProduct = await Product.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200, true, "Product delete successfully!!", null))
})

const getAllProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || Infinity;
    const order = req.query.order || "desc";
    const sortBy = req.query.sortBy || "createdAt";

    const skip = (page - 1) * limit;

    const filterQuery = {};

    if (search) {
        filterQuery.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ]
    }

    if (category) {
        filterQuery.category = category
    }

    filterQuery.price = { $gte: minPrice, $lte: maxPrice }

    const totalProducts = await Product.countDocuments(filterQuery)

    const products = await Product.find(filterQuery)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit)

    return res.status(200).json(
        new ApiResponse(200, true, "Products fetching successfully!!", {
            products,
            pagination: {
                currentPage: page,
                totalPage: Math.ceil(totalProducts / limit),
                hasNextPage: page < Math.ceil(totalProducts / limit),
                hasPrevPage: page > 1,
                totalProducts
            }
        })
    )
})

const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)

    if (!product) {
        throw new ApiError(404, "Product is not found with this id!!");
    }

    return res.status(200).json(new ApiResponse(200, true, "Product Fetch Successfully!!", product))
})

const getNewArrival = asyncHandler(async (req, res) => {
    const products = await Product.find({ newArrival: true })
    return res.status(200).json(new ApiResponse(200, true, "Fetch newArrivals !!", products))
})

const getSaleProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({ isSale: true })
    return res.status(200).json(new ApiResponse(200, true, "Fetch sales products!!", products))
})

const getFeaturedProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true })
    return res.status(200).json(new ApiResponse(200, true, "Fetching Featured!!", products))
})

export { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct, getNewArrival, getSaleProduct, getFeaturedProduct }