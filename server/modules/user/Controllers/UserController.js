const User = require('../Models/UserModel');
const jwt = require('../../../middleware/jwt')
const bcrypt = require('bcrypt');
const ActivityLogs = require('../../Activity/Models/ActivityLog')
const fs  = require('fs');

const emailtemplates = fs.readFileSync("Templates/passwordreset.html", "utf8")

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}


// Sign Up
exports.signup = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, role, source, phone } = req.body
        const path = req.file.path.replace(/\\/g, "/");
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            email, password: hashedPassword, role: role, firstName, lastName, source, phone, profile_image: path
        });

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            data: newUser,
            accessToken: accesstoken
        })
    } catch (error) {
        console.log(error)
        next(error)

    }
}

//Login

exports.login = async (req, res) => {
    try {
        let result = await User.findOne({ email: req.body.email }).lean();
        if (result) {
            const nDate = new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Calcutta'
            });
           
                let passCheck = bcrypt.compareSync(req.body.password, result.password);
                if (passCheck == false) {
                    return res.status(200).send({ statusCode: 401, message: "Incorrect Password" })
                }
                else {
                    const token = await jwt.generateAuthJwt({
                        email: result.email,
                        role: result.role,
                        _id: result._id,
                        expires_in: process.env.TOKEN_EXPIRES_IN

                    })
                    let data = { logged_times: 1 }
                     await User.findByIdAndUpdate(result._id, data, { new: true }).lean()
                
                
                    let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: "Logged In", Module_name: "Login", Role: result.role })
                    await Activitylog.save()
                    return res.status(200).send({ statusCode: 200, message: "Successfully Logged in", result: result, token: token })


                } 
            
            
        }

        else {

            return res.status(200).send({ statusCode: 404, message: "User does not Exists" })
        }


    }
    catch (error) {
        console.log(error)
        return res.status(200).send({ statusCode: 400, message: "Invalid Input", error: error })
    }

}


exports.resetPassword = async (req, res) => {
    try {
        let token = req.token
        let user = await User.findOne({ _id: token._id }).lean()

        if (user && (user.role == 'SuperAdmin' || user.role == "Admin")) {
            req.body.password = bcrypt.hashSync(req.body.password, 12)
            let result = await User.findByIdAndUpdate(token._id, { password: req.body.password, onetimepassword: false }, { new: true })
            if (result) {
                let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: "Reset password", Module_name: "Login", Role: result.role })
                await Activitylog.save()
                return res.status(200).send({ statusCode: 200, message: `Successfully Updated Password`, Result: result })
            }

            else
                return res.status(200).send({ statusCode: 500, message: "Something Went Wrong!" })

        }
        else
            return res.status(200).send({ statusCode: 404, message: "User Not Found!" })

    }

    catch (error) {
        console.log(error)
        return res.status(200).send({ statusCode: 400, message: "Invalid Input", error: error })
    }
}


exports.getUsers = async (req, res) => {
    try {
        let token = req.token
        let user = await User.findOne({ _id: token._id }).lean()

        if (user && (user.role == 'SuperAdmin')) {
            let result = await User.find({role:'Admin'}).lean()
            if (result) {
                let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: "Got all Admin", Module_name: "Admin", Role: result.role, Result: result })
                await Activitylog.save()
                return res.status(200).send({ statusCode: 200, message: `Successfully Got all Admin`, Result: result })
            }

            else
                return res.status(200).send({ statusCode: 500, message: "Something Went Wrong!" })
        }
        else
        return res.status(200).send({ statusCode: 404, message: "User Not Found!" })

    }

    catch (error) {
        console.log(error)
        return res.status(200).send({ statusCode: 400, message: "Invalid Input", error: error })
    }
}


exports.changepassword = async (req, res) => {
    try {
        let token = req.token
        let user = await User.findOne({ _id: token._id }).lean()

        if (user && user.role == 'Admin' || user.role=='Attendee') {
            let passCheck = bcrypt.compareSync(req.body.password, user.password);
            if (passCheck == false) {
                return res.status(200).send({ statusCode: 401, message: "Incorrect Password" })
            }
            if (req.body.newpassword == req.body.password) {
                return res.status(200).send({ statusCode: 401, message: "New Password is similar to Old Password" })
            }
            else {
                req.body.newpassword = bcrypt.hashSync(req.body.newpassword, 12)
                let result = await User.findByIdAndUpdate(token._id, { password: req.body.newpassword }, { new: true })
                if (result) {
                    let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: "Changed password", Module_name: "Login", Role: result.role })
                    await Activitylog.save()
                    return res.status(200).send({ statusCode: 200, message: `Successfully Updated password`, Result: result })
                }

                else
                    return res.status(200).send({ statusCode: 500, message: "Something went wrong!" })

            }



        }
        else
        return res.status(200).send({ statusCode: 404, message: "User Not Found!" })

    }

    catch (error) {
        console.log(error)
        return res.status(200).send({ statusCode: 400, message: "Invalid Input", error: error })
    }
}



exports.logout = async (req, res) => {
    try {
        let token = req.token

        let user = await User.findOne({ _id: token._id }).lean()
      
        if (user && (user.role == 'Attendee'|| user.role=='Admin'|| user.role=='SuperAdmin')) {        
                 let notification =   await PushNotification.findOneAndDelete({fcm_token:req.body.fcm_token})
                 
                    let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: "Logged Out", Module_name: "Logout", Role: user.role })
                    await Activitylog.save()
                    return res.status(200).send({ statusCode: 200, message: "Successfully Logged Out" })

                }

        else {

            return res.status(200).send({ statusCode: 404, message: "User Not Found!" })
        }


    }
    catch (error) {
        console.log(error)
        return res.status(200).send({ statusCode: 400, message: "Invalid Input", error: error })
    }

}

exports.forgotPassword = async(req,res) => {
    try{  
            let  result = await User.findOne({email:req.body.email})
            
              if(result){

                let subject = `Event PLus - Event Configuration`
                let url = `https://admin.event-plus.in/reset-password/?user_id=${result.id}&?name=${result.Name}`

                let html = emailtemplates.replace('{url}',  url).replace("{name}", result.Name)
                let mail = await Email.autoMail(to = req.body.email,subject, html)
                let Activitylog = new ActivityLogs({ userId: result._id, Activity_name: "Forgot Password", Module_name: "Login", Role: result.role })
                await Activitylog.save()
                 return res.status(200).send({statusCode:200,message:"Email Sent Successfully"})
              
              }else {
                
                return res.status(200).send({statusCode:400, message: 'No User found with this email' });
                

              }


    } catch(error) {
        return res.status(200).send({ statusCode: 500, message: "Invalid Input", error: error.message })

    }
}  

exports.resetpassword =  async(req, res) => {
    let user_id = req.params.id
    try{
        let user =  await User.findOne({_id:user_id})

        if (user && (user.role == 'Attendee'|| user.role=='Admin'|| user.role=='SuperAdmin')) { 
            if(!user){
                return res.statud(401).send({statusCode:401, message:"User Not Found"})
            }
            if(user){
                req.body.password = bcrypt.hashSync(req.body.password, 12)
                let update = await User.findByIdAndUpdate(user_id, { password: req.body.password }, { new: true })
                let Activitylog = new ActivityLogs({  Activity_name: "Reset Password", Module_name: "Login", Role: user.role })
                await Activitylog.save()
                return res.status(200).send({statusCode:200,message:"Password Changed Successfully", Result:update})
            }
        
    }
    else
        return res.status(200).send({ statusCode: 400, message: "User does not Exists" })

}catch(error) {
    return res.status(200).send({ statusCode: 500, message: "Invalid Input", error: error.message })

}

}
