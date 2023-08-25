const User = require('../Models/UserModel');
const jwt = require('../../../middleware/jwt')
const bcrypt = require('bcrypt');
const ActivityLogs = require('../../Activity/Models/ActivityLog')
const fs  = require('fs');
const welcomeEmail = fs.readFileSync("Templates/welcomeMail.html", "utf8")
const email = require('../../../helper/emailhelper')
const cloudinary = require("cloudinary")

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function deletefile(file) {
    let url = file.split('/');
    let updated_url = url[url.length - 1]
    let imageName = updated_url.split('.')[0]
    console.log(imageName,'file')
   await cloudinary.v2.uploader.destroy(imageName, function(error,result) {
        console.log(result, error) })
        .then(resp => console.log(resp,'deleted'))
        .catch(_err=> console.log("Something went wrong, please try again later."));
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
       let result
        if (user && (user.role == 'Staff')) {
            if(req.query.key){
                result = await User.find({role:'User',
                 "$or": [{
                    Name: { $regex: req.query.key, $options: 'i' }

                },

                {
                    email : { $regex: req.query.key, $options: 'i' }

                },
                {
                    organization: { $regex: req.query.key, $options: 'i' }

                },
                { designation: { $regex: req.query.key, $options: 'i' } },
                { biography: { $regex: req.query.key, $options: 'i' } },

                ]})
            }
            else
         result = await User.find({role:'User'}).lean()
            if (result) {
                let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: "Got all Users", Module_name: "Users", Role: result.role, Result: result })
                await Activitylog.save()
                return res.status(200).send({ statusCode: 200, message: `Successfully Got all Users`, Result: result })
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



exports.updateProfile = async (req, res) => {
    try {
        let token = req.token
        const find = req.params.id
        let user = await User.findOne({ _id: token._id }).lean()
        if (user && user.role == 'User' ) {
            let data = await User.findById(find)
            console.log(req.files)
            if (req?.files?.image) {
                if (data.image) await deletefile(data.image)
                req.body.image = req.files.image[0].path
            }
            if (req?.files?.file) {
                if (data.file) await deletefile(data.file)
                req.body.file = req.files.file[0].path
            }
            let result = await User.findByIdAndUpdate({
                _id: find, userId: token._id
            },
                req.body,
                { new: true }).lean()

            if (result) {
                let Activitylog = new ActivityLogs({ userId: token._id, Activity: `Succesfully Updated Profile`, Module: "User", Role: token.role, data: result })
                await Activitylog.save()
                return res.status(200).send({ statusCode: 200, message: `Successfully Updated Profile`, Result: result })
            }
           

        else {
            return res.status(200).json({statusCode:500, message: 'Something Went Wrong'})
        }
      } else {
        return res.status(200).json({statusCode:404, message: 'UNAUTHORIZED USER'})
    }

} catch (error) {
    return res.status(200).json({statusCode: 400, message: "something went wrong", result: error.message })

}
}



exports.addUser = async (req, res) => {
    try {
            let data = []
            let result;
            let password;
            if (req?.files?.image) {
                req.body.image = req.files.image[0].path
            }
            else {
                req.body.role = 'User'
                req.body.password = bcrypt.hashSync(req.body.password, 12)
                let user = new User(req.body)
                result = await user.save()

            }
            if (result) {
                const token = await jwt.generateAuthJwt({
                    email: result.email,
                    role: result.role,
                    _id: result._id,
                    expires_in: process.env.TOKEN_EXPIRES_IN

                })
                let subject = `Valiant Communication - User Configuration`
                let html = welcomeEmail.replace("{name}", req.body.Name)
                let mail = email.autoMail(to = req.body.email, subject, html)
                let Activitylog = new ActivityLogs({ userId: token._id, Activity_name: `Successfully Registered`, Module_name: "Audience", Role: token.role, data: result })
                await Activitylog.save()
                return res.status(200).send({ statusCode: 200, message: `Successfully Registered`, Result: result ,token: token  })
            }
            else
                return res.status(200).send({statusCode:500, message: "Something Went Wrong!" })
      
    
    } catch(error) {
        if(error.code==11000){
            return res.status(200).send({ message: "Duplicate Entry", error: error })
        }
        console.log(error)
        return res.status(200).send({ message: "Invalid Input", error: error })
    }

}
