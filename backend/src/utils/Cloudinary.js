import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const normalizedPath = path.resolve(localFilePath);         //Ye line usko proper full path bana degi, jo system ko clearly samajh aaye:
    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "auto"
    });

    // console.log("✅ File uploaded on Cloudinary!");
    fs.unlinkSync(localFilePath);
    return response;

  } catch (err) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    // console.error("❌ Cloudinary Upload Error:", err);
    return null;
  }
};

export { uploadOnCloudinary };
