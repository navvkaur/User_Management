const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY


exports.generateAuthJwt = async (payload) =>{
    const {expires_in, ...params} = payload
    const token = jwt.sign(params,SECRET_KEY,{expiresIn: expires_in} )

if(!token){
    return false
}
return token
}

exports.decodeToken = (req, res, next) => {
    try {
        let token = req.headers.token
        if (!token) {
            return res.status(200).send({ msgCode: 'MISSING_TOKEN' });
          }
        jwt.verify(token, SECRET_KEY, async (error, decoded) => {
            if (error) {
                let msgCode="INVALID_TOKEN"
                if(error.message=="jwt expired"){
                    msgCode='TOKEN_EXPIRED'
                }
                return res.status(200).send({statusCode:401,message : msgCode})
            }
            const {_id} = decoded
            req.token = decoded;
            return next();
        })
    } catch (err) {
        console.log("______________________", err)
        return res.status(200).send({statusCode : 403,message : 'INTERNAL_SERVER_ERROR' })

    }
}

// module.exports={
//     generateAuthJwt
// }
