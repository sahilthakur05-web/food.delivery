const express = require('express');
const { createCate, getCategory,updateCategory ,getSindleCategory,deleteCategory} = require('../Controllor/createCate');
const { requireSignIn, isAdmin } = require('../Middleware/userMiddleware');
const router = new express();


router.post('/create-category',requireSignIn,isAdmin,createCate)
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategory)
router.get('/get-category',getCategory)
router.get('/single-category/:slug',getSindleCategory)
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategory)

module.exports= router