const { MongoGridFSChunkError } = require('mongodb');
const mongoose=require('mongoose');

const couponSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
    },
    percentage:{
        type:Number,
        required:true,
    },
    minpurchase:{
        type:Number,
        required:true,
    },
    maxAmount:{
        type:Number,
        required:true,
    },
    expiry:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:"Active"
    }
})

module.exports=mongoose.model("Coupons",couponSchema);