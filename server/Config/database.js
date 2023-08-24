const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../modules/user/Models/UserModel')
const bcrypt=require("bcrypt")
exports.connection = async () => {
    try{
        mongoose.set("strictQuery", false)
        await mongoose.connect(process.env.MONGO_URL);
        console.log('________________________________________\n<- ✅ Database Connection Established ->\n________________________________________\n');
        mongoose.set('debug', true);
        await User.findOne(
            {  role: "Staff" }).then(async userRes=>{
                if(userRes){
                 console.log("Default Staff already exist");
                }
                else
                {
                    let createAdmin = {
                        Name: "Valiant Communication",
                        email: "kaur2305navneet@gmail.com",
                        phone: 1234567890,
                        password: bcrypt.hashSync("Admin@1234",12),
                        role: "Staff",
                        
                      };  
                     let saveResult=  await User(createAdmin).save() 
                     if(saveResult){
                      console.log("successfull created Admin")
                     }
                     else{
                    console.log("Failed to create ADMIN! ABORTING")
                    return
                
                     }
                }
             
            }).catch(userErr=>{
               console.log({errror : userErr})
               return
            })
        
        
    }catch(err){
        console.log('_________________________________________\n<- ⚠️ Database Connection Unsuccessful  ->\n_________________________________________\n');
        throw err;
    }
}