const Razorpay = require('razorpay'); 
const orderid = require('order-id')('key');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/UserModel');
const { default: mongoose } = require('mongoose');
const { default: axios } = require('axios');
const crypto = require('crypto');
const Order=require('../models/orderModel')
const Coupon=require('../models/couponModel')
const cartController=require('../controllers/cartController')


const razorpayInstance = new Razorpay({

    key_id:  process.env.RAZORPAY_KEY_ID,

    key_secret:  process.env.RAZORPAY_KEY_SECRETE,
});


const createRazorpayOrder = async (req, res) => {
   
    const walletUsed=req.body.walletUsed
  const userid = req.session.userId;
  const orderId = orderid.generate();
  let couponId=req.query.couponId
  let walletBalance=0
  let discount=0
  try {
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userid) }).populate("cart.product");

      if (couponId && typeof couponId !== "undefined") {
        const coupon = await Coupon.findOne({ _id:new mongoose.Types.ObjectId(couponId) });
        if (coupon) {
          discount = coupon.percentage;
        }
      }
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      walletBalance=user.wallet
      const cart = user.cart;
      let totalPrice = 0;
      let totalSalePrice = 0;

      for (let i = 0; i < cart.length; i++) {
          totalPrice += cart[i].product.price * cart[i].quantity;
          totalSalePrice += cart[i].product.saleprice * cart[i].quantity;
      }

      
  let CouponAppliedPrice=totalSalePrice - (totalSalePrice * (discount / 100));
  const couponSaving=totalSalePrice-CouponAppliedPrice


      const orderbasket = [];

      for (let i = 0; i < cart.length; i++) {
          const product = cart[i].product;
          const price = product.price;
          const broughtPrice = product.saleprice;
          orderbasket.push({
              product: product._id,
              quantity: cart[i].quantity,
              price: price,
              broughtPrice: broughtPrice,
          });
      }
     if(walletUsed==='true'){
        CouponAppliedPrice-=walletBalance
     }
     if(CouponAppliedPrice<=0){
        res.redirect(`/home/cart/proceedPayment/placeOrder?method=Wallet&couponId=${couponId}`);

     }else{


      const razorpayOrder = await razorpayInstance.orders.create({
          amount: CouponAppliedPrice * 100,
          currency: "INR",
          receipt: orderId,
      });

    
  
     
      res.render('payment', { totalPrice, totalSalePrice, razorpayOrder ,CouponAppliedPrice,couponId,couponSaving,walletBalance});
    }
  } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return res.status(500).json({ error: "Error creating Razorpay order" });
  }
};

 const verifyPayment=(req, res)=>{
	
	
	const {order_id, payment_id} = req.body;	

    

	const razorpay_signature = req.headers['x-razorpay-signature'];

    

	const key_secret =  process.env.RAZORPAY_KEY_SECRETE;	

	
	let hmac = crypto.createHmac('sha256', key_secret);

	hmac.update(order_id + "|" + payment_id);
	
	
	const generated_signature = hmac.digest('hex');

	
	if(razorpay_signature===generated_signature){   
		
        res.json({success:true})
	}
	else
    console.log("payment verification failed");
	res.json({success:false, message:"Payment verification failed"})
};




module.exports = {
  createRazorpayOrder, 
  verifyPayment,
  
};
