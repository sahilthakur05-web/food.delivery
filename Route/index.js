const express = require('express');
const router = new express();
const user = require('./userRoute')
const cate = require('./cateRoute')
const pro = require('./productRoute')
router.use('/user',user)
router.use('/cate',cate)
router.use('/pro',pro)




module.exports = router;