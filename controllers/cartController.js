const Product=require('../models/productModel')
const Order=require('../models/orderModel')
const Category=require('../models/categoryModel')
const User=require('../models/UserModel')
const { default: mongoose } = require('mongoose');
const orderid = require('order-id')('key');
const autMiddleware=require('../controllers/authMiddleware');
const Coupon=require('../models/couponModel')
const SalesReport=require('../models/salesReportModel')
const {v4 : uuidv3} = require("uuid")


const addToCart = async (req, res) => {
  if (!req.session.isAuth) {
   
    return res.status(302).json({ success: false, redirectTo: '/user/login' });
}

  const userid = req.session.userId;
  const { productId } = req.body;

  try {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userid) });

    const productCount=await Product.findOne({_id:new mongoose.Types.ObjectId(productId)}).stock
    if(productCount===0){
      res.json({succcess:false,message:"Item Out of Stock"})
    }else{

    const existingCartItem = user.cart.find((item) => item.product.equals(productId));

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
       
      });
    }

    await user.save();

    res.json({ success: true, message: "Item added to cart" });

  }
  } catch (error) {
  
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred on the server" });

  }
};


const loadCart=async(req,res)=>{
 
  const userid=req.session.userId
  const product = await User.findOne({ _id: new mongoose.Types.ObjectId(userid) })
    .populate('cart.product')
    .sort({ createdAt: 1 });

   
  const coupons=await Coupon.find({status:"Active"})
 
  

  const user=await User.findOne({_id:new mongoose.Types.ObjectId(userid)})

  const walletBalance=user.wallet

  
  res.render('cart',{product,coupons});

}



const changeQuantity=async(req,res)=>{
 
 const {productId,cartId,value}=req.body
 
  if(value=="dec"){
    try{

      const userid=req.session.userId
      const user=await User.findOne({ _id:new mongoose.Types.ObjectId(userid)})
      const cartItem = user.cart.find((item) => item.product.equals(productId));
      const cartCount = cartItem.quantity;
      if(cartCount>1){
     await User.updateOne(
     {
      _id:new mongoose.Types.ObjectId(userid),
      'cart._id':new mongoose.Types.ObjectId(cartId) 
     },
     {
      $inc: {
        'cart.$.quantity': -1
      }
    }
  );
 
  res.json({success:true})
      }
}
catch (err) {
  console.error('Error:', err);
} 
}

  else if (value == "inc") {

    try {
      const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId)
      });
      productStock=product.stock
      const userid=req.session.userId

      const user=await User.findOne({ _id:new mongoose.Types.ObjectId(userid)})
  
      const cartItem = user.cart.find((item) => item.product.equals(productId));
      const cartCount = cartItem.quantity;

    if(cartCount<=productStock){

      await User.updateOne(
        {
          _id:new mongoose.Types.ObjectId(userid),
          'cart._id': new mongoose.Types.ObjectId(cartId)
        },
        {
          $inc: { 
            'cart.$.quantity': 1
          }
        }
      );
  
      res.json({success:true})
    }else{
      res.json({success:false,message:`Only ${cartCount} left`})
    }
    } catch (err) {
      console.error('Error:', err);
    }
  }
  
  }

const removeFromCart=async(req,res)=>{
  try{
    const userid=req.session.userId
  const id=req.query.id
  await User.updateOne(
    {_id:new mongoose.Types.ObjectId(userid)},
    { $pull: { cart: { product:new mongoose.Types.ObjectId(id) } } }
  );
  res.redirect('/home/cart')
  }catch(error){
    console.log(error);
  }
}
const addToWishlistFromCart=async(req,res)=>{
  const userid=req.session.userId
  const productId = req.query.id;
  const id=productId;
 
  try {
    const user = await User.findOne({_id:new mongoose.Types.ObjectId(userid) });

    if (!user) {
      setTimeout(()=>{
          res.redirect('/user/login');
      },1000)
     
    }

      user.wishlist.push({
        product:productId
        
      });
      await user.save();
   
      await User.updateOne(
        {_id:new mongoose.Types.ObjectId(userid)},
        { $pull: { cart: { product:productId  } } }
      );

      

      setTimeout(() => {
          res.redirect('/home/cart/');
      }, 1500);
   
   

  } catch (error) {
   console.log(error);
  }


}


const addToWishlist=async(req,res)=>{
  if (!req.session.isAuth) {
    // Redirect the user to the login page
    return res.status(302).json({ success: false, redirectTo: '/user/login' });
}
  const userid=req.session.userId
  const productId = req.body.productId;
 
 
  try {
    const user = await User.findOne({_id:new mongoose.Types.ObjectId(userid) });


      user.wishlist.push({
        product:productId
        
      });
      await user.save();
   
   
      res.json({ success: true, message: "Item added to Wishlist" });

    
    } catch (error) {
    
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred on the server" });
  
    }


}


const loadSelectAdress = async (req, res) => {
let discount=0
let maxAmount=0

  const userid=req.session.userId
  const {couponId,newPrice}=req.query
  
  const user = await User.findOne({ _id:new mongoose.Types.ObjectId(userid) }).populate("cart.product");
  const coupon=await Coupon.findOne({_id:new mongoose.Types.ObjectId(couponId)})
  if(coupon){
    discount=coupon.percentage
     maxAmount=coupon.maxAmount
  }
  const cart = user.cart;
  let totalPrice = 0;
  let totalSalePrice = 0;

  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].product.price * cart[i].quantity;
    totalSalePrice += cart[i].product.saleprice * cart[i].quantity;
  }

  let CouponAppliedPrice=Math.ceil(totalSalePrice - (totalSalePrice * (discount / 100)));
  let couponSaving= Math.ceil(totalSalePrice-CouponAppliedPrice)
  if(couponSaving>maxAmount){
    couponSaving=maxAmount
    CouponAppliedPrice=totalSalePrice-couponSaving
    }
  addressIndex=user.selectedAddressIndex;
  const address = user.address[addressIndex];
  const addressList=user.address;

  res.render("addressSelect", { address,addressList, totalPrice, totalSalePrice,couponSaving,CouponAppliedPrice,couponId });
};



const updateAddressIndex = async (req, res) => {
  const { selectedAddressIndex } = req.body;
  const userid=req.session.userId

  try {
    await User.updateOne({_id:new mongoose.Types.ObjectId(userid) }, { $set: { selectedAddressIndex: selectedAddressIndex } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error occurred:', error);
    res.json({ success: false });
  }
};

const loadProceedPayment = async (req, res) => {
  try {
    const userid = req.session.userId;
    const { couponId } = req.query;
    let discount = 0;
let maxAmount=0
    if (!userid) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const user = await User.findOne({ _id:new mongoose.Types.ObjectId(userid) }).populate("cart.product");

    if (couponId && typeof couponId !== "undefined") {
      const coupon = await Coupon.findOne({ _id:new mongoose.Types.ObjectId(couponId) });
      if (coupon) {
        discount = coupon.percentage;
        maxAmount=coupon.maxAmount
      }
    }

    const cart = user.cart;
    let totalPrice = 0;
    let totalSalePrice = 0;

    for (let i = 0; i < cart.length; i++) {
      totalPrice += cart[i].product.price * cart[i].quantity;
      totalSalePrice += cart[i].product.saleprice * cart[i].quantity;
    }

    let CouponAppliedPrice = Math.ceil(totalSalePrice - (totalSalePrice * (discount / 100)))
    let couponSaving = Math.ceil(totalSalePrice - CouponAppliedPrice)
    if(couponSaving>maxAmount){
      couponSaving=maxAmount
      CouponAppliedPrice=totalSalePrice-couponSaving
      }
  const walletBalance=user.wallet

    res.render('payment', {
      totalPrice,
      totalSalePrice,
      couponSaving,
      CouponAppliedPrice,
      couponId,
      walletBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the payment" });
  }
};



const placeOrder = async (req,res) => {
  console.log("new",req.query);
  let maxAmount=0
  let discount=0
  let couponCode="NA"
  const paymentMethod=req.query.method;
  const userid=req.session.userId
  const couponId=req.query.couponId
  const orderId = orderid.generate();

  try {
    
    const user = await User.findOne({ _id:new mongoose.Types.ObjectId(userid) }).populate("cart.product");
    if (couponId && typeof couponId !== "undefined") {
      const coupon = await Coupon.findOne({ _id:new mongoose.Types.ObjectId(couponId) });
      if (coupon) {
        discount = coupon.percentage;
        couponCode=coupon.code
        maxAmount=coupon.maxAmount
      }
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
  const cart=user.cart
  let totalPrice = 0;
  let totalSalePrice = 0;
  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].product.price * cart[i].quantity;
    totalSalePrice += cart[i].product.saleprice * cart[i].quantity;
  }
  let CouponAppliedPrice = Math.ceil(totalSalePrice - (totalSalePrice * (discount / 100)))
  let couponSaving = Math.ceil(totalSalePrice - CouponAppliedPrice)
  if(couponSaving>maxAmount){
    couponSaving=maxAmount
    CouponAppliedPrice=totalSalePrice-couponSaving
    }

const orderbasket = [];

for (let i = 0; i < cart.length; i++) {
  
  const product = cart[i].product;

  const price = product.price 

  const broughtPrice=product.saleprice

  orderbasket.push({
    product: product._id,
    quantity: cart[i].quantity,
    price: price,
    broughtPrice: broughtPrice,
    status:"Pending"
  });
}
 

    const order = new Order({
      orderId,
      user: user._id,
      cart:orderbasket,
      totalPrice:totalPrice,
      bagSaving:totalPrice-totalSalePrice,
      totalSalePrice:totalSalePrice ,
      couponSaving:couponSaving,
      broughtPrice:CouponAppliedPrice,
      coupon:couponCode,
      shippingAddress: user.address[user.selectedAddressIndex],
      paymentMode:paymentMethod,
      status: "Pending",
    });
    
   await order.save();
    
    user.cart=[];
    user.save();
    for (let i = 0; i < orderbasket.length; i++) {
      const product = orderbasket[i].product;
      const productQuantity=orderbasket[i].quantity
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { stock: -productQuantity } },
        { new: true }
      );
    if(paymentMethod=='Wallet'){
      user.wallet-=CouponAppliedPrice
      user.save();
    }
      if (!updatedProduct || updatedProduct.stock < 0) {
       
        console.log(`Product ${product} is out of stock.`);
        
      }
    }


    const orderPlaced=await Order.findOne({orderId:orderId}).populate("cart.product").populate('user')
    await updateSalesReport(orderPlaced);
  
  res.render('orderPlaced',{orderPlaced})
   
  } catch (error) {
    console.error(error);
   
  }
};





async function updateSalesReport(order) {
  try {
    const orderDate = order.createdAt.toISOString().split('T')[0];
    const orderBroughtPrice = order.broughtPrice;
    let orderProductCount=0

   for(let i=0;i<order.cart.length;i++){
     orderProductCount+=order.cart[i].quantity
   }
    const orderCount = 1; 

    
    const existingReport = await SalesReport.findOne({ date: orderDate });

    if (existingReport) {
      
      existingReport.totalSales += orderBroughtPrice;
      existingReport.productCount += orderProductCount;
      existingReport.orderCount += orderCount;
      await existingReport.save();
    } else {
      
      const newReport = new SalesReport({
        date: orderDate,
        totalSales: orderBroughtPrice,
        productCount: orderProductCount,
        orderCount: orderCount,
      });
      await newReport.save();
    }

    
  } catch (error) {
    console.error('Error updating sales report:', error);
  }
}





const verifyCoupon=async(req,res)=>{

  const {couponId,purchaseValue }= req.body;
  
  if (couponId==null) {
    return res.json({ valid: false, message: 'Coupon not Applied' });
  }

  try {
   
    const coupon = await Coupon.findOne({
      _id: couponId,
      expiry: { $gte: new Date() },
      status: 'Active'
    });

    if (!coupon) {
      return res.json({ valid: false, message: 'Invalid coupon code.' });
    }

    if (purchaseValue < coupon.minpurchase) {
      const requiredAmount = coupon.minpurchase - purchaseValue;
      return res.json({
        valid: false,
        message: `Add ₹${requiredAmount} more to apply this coupon.`
      });
    }
console.log(coupon.maxAmount)
    return res.json({ valid: true, couponPercentage: coupon.percentage,maxAmount:coupon.maxAmount }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred.' });
  }
}

const moveToCart = async (req, res) => {
  try {
    const userid = req.session.userId;
    const productId = req.body.productId;

    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userid) })
      .populate('cart.product'); // Make sure to populate the cart.product field

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const existingCartItem = user.cart.find(
      (item) => item.product && item.product.equals(new mongoose.Types.ObjectId(productId))
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    // Remove from wishlist (replace id with productId)
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userid) },
      { $pull: { wishlist: { product: new mongoose.Types.ObjectId(productId) } } }
    );

    await user.save();

    res.json({ success: true, message: "Moved to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred, please try again" });
  }
};

const removeFromWishlist=async(req,res)=>{
  try {
    const userid = req.session.userId;
    const productId = req.body.productId;

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userid) },
      { $pull: { wishlist: { product: new mongoose.Types.ObjectId(productId) } } }
    );

    // await user.save();

    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred, please try again" });
  }
}


module.exports={
    addToCart,
    loadCart,
    changeQuantity,
    removeFromCart, 
    addToWishlistFromCart,
    addToWishlist,
    loadSelectAdress,
    updateAddressIndex,
    loadProceedPayment,
    placeOrder,
    
    verifyCoupon,
    moveToCart,
    removeFromWishlist,
    
}  