import { v2 as cloudinary } from "cloudinary";

 const cloud = async function () {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });
};

export default cloud;