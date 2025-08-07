import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { BusinessDetail } from "../models/Business_details.js";
import fs from "fs";


export const addBusiness = asyncHandler(async (req, res) => {

    const {
        businessName,
        businessAddress,
        businessDescription,
        phoneNumber,
        businessCategory,
        businessType,
        experience,
        openTime,
        closeTime,


    } = req.body



    // console.log("request files ", req.files)
    const businessImageLoacalPath = await req.files?.businessImage[0]?.path;
    // console.log("ye hamara local path hai Business image LocalPath", businessImageLoacalPath)

    if (!businessImageLoacalPath) {
        throw new ApiError(400, " buisness image  file is required ")
    }

    const businessImage = await uploadOnCloudinary(businessImageLoacalPath);

    if (!businessImage) {
        throw new ApiError(400, "businessImage file is required")
    }



    // ✅ Ensure coordinates are parsed as numbers (important line )
    const parsedLongitude = parseFloat(req.body.longitude);
    const parsedLatitude = parseFloat(req.body.latitude);

    if (
        isNaN(parsedLongitude) || isNaN(parsedLatitude) ||
        parsedLongitude < -180 || parsedLongitude > 180 ||
        parsedLatitude < -90 || parsedLatitude > 90
    ) {
        throw new ApiError(400, "Invalid longitude or latitude provided");
    }






    // ✅ Create Business Document
    const business = await BusinessDetail.create({
        owner: req.user._id,
        businessName,
        businessAddress,
        businessDescription,
        phoneNumber,
        businessCategory,
        businessType,
        businessImage: businessImage.url,
        experience,
        openTime,
        closeTime,
        location: {
            type: "Point",
            coordinates: [parsedLongitude, parsedLatitude]
        }
    });



    if (fs.existsSync(businessImageLoacalPath)) {
        fs.unlinkSync(businessImageLoacalPath);
    }



    res.status(201).json({
        success: true,
        message: "Business listed successfully!",
        data: business
    });

})

// get  mylist of businesses 

// controllers / business.js

// 🧍1. Get current user’s own listings
// GET /api/business/my
// .sort({ createdAt: -1 })
// Ye kaam karta hai: Latest business first dikhane ka.

// MongoDB me har document me createdAt field hoti hai (agar timestamps enable ho).

// -1 ka matlab descending order → newest to oldest.

export const getMyBusinesses = asyncHandler(async (req, res) => {
    // req.user set by verifyJWT middleware
    const userId = req.user._id;

    // Find all businesses where owner matches logged‑in user
    const businesses = await BusinessDetail.find({ owner: userId }).sort({ createdAt: -1 });

  return    res.status(200).json({
        success: true,
        count: businesses.length,
        data: businesses
    });
});



//deleeting business  // 🗑 2. Delete a business listing by ID
// DELETE /api/business/:id


export const deleteBusiness = asyncHandler(async (req, res) => {
    const businessId = req.params.id;        // jis business pr delete karega usko khli delete karo 
    const userId = req.user._id;

    // Fetch the business
    const business = await BusinessDetail.findById(businessId);  // ye wla necche deklho  deleteOne ke pass
    if (!business) {
        throw new ApiError(404, 'Business not found');
    }

    // Ensure only the owner can delete
    if (business.owner.toString() !== userId.toString()) {  // ye ye check karega ki khli  jo  jisne business lists kia hai  whi khli dleete karega 

        throw new ApiError(403, 'Not authorized to delete this business');
    }

    // Delete the document
    await business.deleteOne();       // ye bsuiness matalb BusinessDetails wla object oopr  dekho same  hai value
    
    return res.status(200).json({
        success: true,
        message: 'Business deleted successfully'
    });
});

export const getServicesByCategory = asyncHandler(async (req, res) => {
    const category = req.params.category;

    // Find all businesses in the specified category
    const businesses = await BusinessDetail.find({ businessCategory: category }).sort({ createdAt: -1 });

    if (!businesses || businesses.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No businesses found in this category'
        });
    }

    return res.status(200).json({
        success: true,
        count: businesses.length,
        data: businesses
    });
});

export const updatedBusiness = asyncHandler(async (req, res) => {
    const businessId = req.params.id;
    const userId = req.user._id;

    // Fetch the business
    const business = await BusinessDetail.findById(businessId);
    if (!business) {
        throw new ApiError(404, 'Business not found');
    }

    // Ensure only the owner can edit
    if (business.owner.toString() !== userId.toString()) {
        throw new ApiError(403, 'Not authorized to edit this business');
    }

    // Update fields
    const updatedFields = {
        ...req.body,
        businessImage: req.files?.businessImage ? await uploadOnCloudinary(req.files.businessImage[0].path) : business.businessImage
    };

    // Update the business document
    const updatedBusiness = await BusinessDetail.findByIdAndUpdate(businessId, updatedFields, { new: true });

    return res.status(200).json({
        success: true,
        data: updatedBusiness
    });
});