const express = require('express')
const { createProduct, getProducts,getSingleProduct,ProductPhoto,deleteProducts,updateProduct,productFilter ,searchProductControllor,realtaedProduct,productCategory,braintreeTokenController,braintreePaymentController,getOrders} = require('../Controllor/createProduct')
const formidable = require('express-formidable')
const { requireSignIn, isAdmin } = require('../Middleware/userMiddleware')

const router = new express()

router.post('/create-pro',requireSignIn,isAdmin,formidable(),createProduct)
router.get('/get-pro',getProducts)
router.get('/get-pro/:slug',getSingleProduct)
router.get('/ProductPhoto/:id',ProductPhoto)
router.delete('/delete-product/:pid',deleteProducts)
router.put('/update-pro/:pid',requireSignIn,isAdmin,formidable(),updateProduct)
// filter product
router.post('/product-filter',productFilter)


// search product 
router.get('/search/:keyword',searchProductControllor)

// similar product
router.get('/related-pro/:pid/:cid',realtaedProduct)

// category wise product
router.get('/product-category/:slug',productCategory)

// payments routes
// token

router.get('/braintree/token',braintreeTokenController)

// payments
router.post('/braintree/payment',requireSignIn,braintreePaymentController)



module.exports = router