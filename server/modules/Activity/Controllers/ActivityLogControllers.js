const User = require('../../user/Models/UserModel')
const ActivityLogs = require('../Models/ActivityLog')
const mongoose = require('mongoose')

exports.getlogs = async (req,res) => {
try{
    let token = req.token
       
        let user = await User.findOne({_id:token._id}).lean()
        if (user && user.role == 'SuperAdmin' ) {
           let result = await ActivityLogs.find().lean()
            if (result){
                let Activitylog = new ActivityLogs({userId:token._id,Activity_name:`Getting Activity Logs`,Module_name:"Activity", Role:token.role, data:result })
                await Activitylog.save()
                return res.status(200).send({ statusCode:200,message: `Getting Activity Logs`, Result: result })
            }
            else
                return res.status(200).send({statusCode:401, message: "Something went wrong!" })
        }
    
    else
        return res.status(200).send({statusCode:401, message: "UNAUTHORIZED USER" })


} catch(error) {
    console.log(error)
    return res.status(200).send({ message: "Invalid Input", error: error })
}

}