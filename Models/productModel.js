const mongoose = require('mongoose')
const schema = mongoose.Schema;
const proSchema = schema({
    name:{
        type:String,
        require:true
    },
    slug:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    oldPrice:{
        type:Number,
        require:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'cate',
        require:true
    },
    photo:{
        data:Buffer,
        contentType:String
    }
})

module.exports= mongoose.model('pro',proSchema)