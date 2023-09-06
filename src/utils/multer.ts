import multer from "multer";
import dotenv from 'dotenv';
dotenv.config();

const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file) =>{
        return {
            folder: 'swiftRider',
        }
    },
})

export const upload = multer({storage:storage});