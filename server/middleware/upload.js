require('dotenv').config()
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs")
          
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key:process.env.api_key, 
  api_secret: process.env.api_secret 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "UploadFiles",
  },
});

exports.uploadImage = multer({
  storage: storage
}).fields([{ name: "image" }, {name:'file'}])