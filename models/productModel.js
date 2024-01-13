const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        default:1
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Product',productSchema);