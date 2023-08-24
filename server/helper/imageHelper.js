require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require("fs")
class ImageController {
  async fileUpload (fileName, destination, fileType) {
     
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION   
    })

    
    const uploadParams = {
      Bucket: 'event-plus',
      Key: '',
      Body: '',
      ACL: 'public-read',
      ContentType: fileType,
      s3ForcePathStyle: true

    } 
    
    let data = fs.readFileSync(`${destination}${fileName}`)
    fileName =fileName.replace(/\s/g, '')
    console.log(fileName,data)
    uploadParams.Key = fileName
    uploadParams.Body = data;

    return s3
      .upload(uploadParams)
      .promise()
      .then(data => {
        console.log("sucess")
        return data
      })
      .catch(err => {
        console.log(err)
        throw err
      }) 
  }

  async deleteFile (fileUrl, s3FolderPath) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    })

    const params = {
      Bucket: 'event-plus', 
      Key: fileUrl
    }
   s3.deleteObject(params,(err,data)=>{
      if(data){
        console.log('Delete Successfully')
        return true
      }
      else{
        console.log(err)
      }
    })
    
    
  }
  
}
module.exports = new ImageController()
