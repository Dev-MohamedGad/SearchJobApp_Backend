import path from "path";
import { config } from "dotenv";
import { v2 as cloudinary, ConfigOptions } from "cloudinary";

config({ path: path.resolve("config/.env") });

const cloudinaryConfig: ConfigOptions = {
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_PASSWORD as string,
    api_secret: process.env.CLOUDINARY_SECRET as string,
    secure: true
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
