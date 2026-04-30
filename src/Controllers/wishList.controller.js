import Product from "../Models/product.model.js";
import User from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";


const toggleWishList = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)

    if (!product) {
        throw new ApiError(404, "Product not found!!")
    }

    let user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found!!")
    }

    const isInWishList = user.wishList.includes(id);

    if (isInWishList) {
        user = await User.findByIdAndUpdate(req.user._id, { $pull: { wishList: id } }, { returnDocument: 'after' })
        return res.status(200).json(
            new ApiResponse(200, true, "Remove from wishList successfully!!", null)
        )
    } else {
        user = await User.findByIdAndUpdate(req.user._id, { $push: { wishList: id } }, { returnDocument: 'after' })
        return res.status(200).json(
            new ApiResponse(200, true, "Add in wishList successfully!!", null)
        )
    }
})

const getAllWishList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishList", "name price images")

    if (!user) {
        throw new ApiError(404, "User not found!!")
    }

    return res.status(200).json(
        new ApiResponse(200, true, "Fetch wishList successfully!!", user.wishList)
    )
})

export { toggleWishList, getAllWishList };