require('dotenv').config()
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs")
          
cloudinary.config({ 
  cloud_name: 'dhasvvc0q', 
  api_key: '799475584154994', 
  api_secret: 'Qo_6Fwrmp9mlFcIGteqb3c8dkBI' 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "UploadFiles",
  },
});

exports.uploadImage = multer({
  storage: storage
}).fields([{ name: "image" }, {name:'resume'}])