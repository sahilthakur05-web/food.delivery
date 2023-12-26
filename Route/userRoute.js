const express = require('express');
const {register, login, testController,getOrderController,getAllOrderController,orderStatus}=require('../Controllor/userControllor');
const { requireSignIn, isAdmin } = require('../Middleware/userMiddleware');
const router = new express();


//routing

//REGISTER || METHOD POST
router.post('/register',register);

//LOGIN || POST 
 router.post('/login',login)

//test route
router.get('/test',requireSignIn,isAdmin,testController)
// router.get('/getUser',getAllUser)

//protected User  route auth 
router.get('/user-auth',requireSignIn,(req,res)=>{
   return res.status(200).send({ok:true})
})
//protected Admin route auth 
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
   return res.status(200).send({ok:true})
})

// update profile
// router.put('/profile',requireSignIn,updateProfile)


//orders
router.get('/orders',requireSignIn,getOrderController)
//all orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrderController)

// order status update

router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatus)
module.exports= router