const JWT = require("jsonwebtoken");
const userModel = require("../Models/userModel");

// protected Routes

const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    req.user = decode
    console.log(req,req.user);
    next();
  } catch (error) {
    console.log(error);
  }
};
// admin access

const isAdmin = async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !==1){
          console.log(user.role);
            return res.status(401).send({
                success:false,
                message:'UnAuthorized Access'
            })
        }
        else{
            next()
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success:false,
            error,
            message:'Error in admin middleware'
        })
    }
}

module.exports={requireSignIn,isAdmin}