import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// get user details from frontend
// validation 
// check if user already exists : username,email
// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return res

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body
    console.log("email: ", email);

    // Below is a way to put same condition in required fields altogether rather than giving if conditions to every fiels like given thoda below

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "This Field is Required")
    }
    // if (fullName==="") {
    //     throw new ApiError(400, "Full Name is Required")
    // }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalFile = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalFile)

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // To check if user is created.This _id is created by mongoDb itself whenever new registers using findById as jaise hi user create hoga uski _Id bnn jaegi.

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // jo hume remove krne hai response se.
    )

    if (!createdUser) {
        throw new ApiError("Something went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Succesfully")
    )

})

export { registerUser }