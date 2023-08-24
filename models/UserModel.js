const mongoose = require("mongoose");
const { default: orderId } = require("order-id");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
     
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: false, 
    },
    password: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      default:"Active"
    },
    address:[ {
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
     
    },
   ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        
        },
     
    ],
    wishlist: [
      {
        product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        }
      },
    ],
    previousOrders: [
      {
      orderNo:{
        type:String

      }
    }
    ],
   
    selectedAddressIndex: {
      type: Number,
      default: 0, 
    },
    wallet:{
      type:Number,
      default:0
    },
    gender:{
      type:String
    },
  },

  { timestamps: true }
);
userSchema.pre("save", function (next) {
  this.name = `${this.firstname} ${this.lastname}`;
  next();
});
module.exports = mongoose.model("User", userSchema);
