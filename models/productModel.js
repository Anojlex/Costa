const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  saleprice: {
    type: Number,
    required: true,
  },
  stock:{
    type:Number
  },
  For:{
    type:String
  },
  size:{
    type:String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand: {
    type: String,
    
  },
  
  sold: {
    type: Number,
    default: 0,
  },
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  color: {
    type: String,
   
  },
  brand:{
    type:String
  },
  status:{
    type:String,
    default:"Active"
  },
  rating: [
    {
      star: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
}, 

{ timestamps: true });
productSchema.index({
 
  description: "text",
  brand: "text",
 For:"text"
 
}),
module.exports = mongoose.model("Product", productSchema);
  