
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type:String,
        required:true,
    },
    
    isActive: {
        type: Boolean,
        default: true
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
    logged_times:{
        type:Number,
        default :0 
    },
    onetimepassword:{
       type: Boolean,
    default:true},
    expireAt:String,
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
    isOnline:{
        type:Boolean,
        default : false
    },
    schedule:
        [{
            type:mongoose.Schema.Types.ObjectId,
            ref :'agenda',
            default:[]
        }],
    image:{
        type: String,
        default: ''
    },
    interest:{
        type:[],
        default:[]
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
});



const User = mongoose.model('User',userSchema);
module.exports = User;

  