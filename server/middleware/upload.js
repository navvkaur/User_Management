const multerS3 = require('multer-s3');
const multer = require('multer'); 
const path = require('path'); 
const AWS = require('aws-sdk')


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION   
})


const storage =  multerS3({
    s3: s3,
      acl: 'public-read',
      bucket: 'event-plus',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
  })
  
  exports.uploadImage = multer({
    storage: storage
  }).fields([{ name: "image" }, {name:'venueMap'},{ name: "bannerimage" },{ name: "document" },{name:"galleryImage"},{name:"bannerImage"},{name:"logo"},{name:"file"}])
  
  

//module.exports = {uploadImage,uploadImageSingle}




// export default upload.single('profile_image');
