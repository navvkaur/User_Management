
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    
    Name:{
        type: String,
        
        required:true,
     },
   
    phone:{
        type:Number,
        
    },
   
    password: {
        type: String,
        required: true
    },
    
    role: {
        type: String,
        required:true,
        Enum :["Staff","User"]
    },
   
    organization:{
        type: String,
        default: ''
    },
   
    designation:{
        type:String
    },
    biography:{
        type:String
  
    },
    
    image:{
        type: String,
        default: ''
    },
    file:{
        type: String,
        default: ''
    },
    
    linkedln_profile:{
        type: String,
        default :''
    },
    instagram_profile:{
        type: String,
        default :''
    },
    twitter_profile:{
        type: String,
        default :''
    },
    facebook_profile:{
        type: String,
        default :''
    },
     timestamps: {} });

     userSchema.set('timestamps', true); // this will add createdAt and updatedAt timestamps


const User = mongoose.model('User',userSchema);
module.exports = User;

  