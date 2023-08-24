const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId:{
    type:String,
    required:true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price:{
        type:Number,
        required:true,
      },
      broughtPrice:{
        type:String,
        required:true,
      },
      
      status: {
        type: String,
        enum: ["Pending","Confirmed", "Processing","Packed", "Shipped","Out for Delivery", "Delivered","Cancelled"],
        default: "Pending",
      },
     
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  totalSalePrice:{
    type:Number,
    required:true
  },
  bagSaving:{
    type: Number,
    required: true,
  },
  couponSaving:{
    type: Number,
    required: true,
  },
  coupon:{
    type: String,
   default:"NA"
  },
  broughtPrice:{
    type: Number,
    required: true,
  },
  shippingAddress: {
    name:{
      type:String,    
      default:function(){
       return this.name
      }
    },
    mobile:{
      type:Number,
     
      default: function(){
        return this.mobile
      } 
    },

    locality: {
      type: String,
      required: true, 
    },
    buildingName:{
      type:String,
      required:true
    }, 
    landmark:{
      type:String,
      required:true, 
    },
    city: {
      type: String,
      required: true, 
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String, 
      required: true, 
    },
    addressType:{
      type:String,
      
    },
    Default:{
     type:String,
     default:"false" 
    }
  },
  status: {
    type: String,
    enum: ["Pending","Confirmed", "Processing","Packed", "Shipped","Out for Delivery", "Delivered","Cancelled"],
    default: "Pending",
  },
  
  paymentMode:{
    type:String
  },
  walletUsed:{
    type:Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
