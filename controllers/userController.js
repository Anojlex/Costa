const Users = require('../models/UserModel');
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const Banner = require('../models/bannerModel')
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const { default: orderId } = require('order-id');
const dotenv = require('dotenv');
dotenv.config();
const accountSid =  process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const customTemplate=require('../models/invoice')

const easyinvoice = require('easyinvoice');
const fs = require('fs');



const loadUserSignup = (req, res) => {

  res.render('signup')
}

const loadSendOtp = (req, res) => {

  res.render('sendotp');
}

const loadVerifyOtp = (req, res) => {
  res.render('verifyOtp');
}

const loadHomepage = async (req, res) => {
  if (req.session.isAuth) {
    isLogedIn = "true";
  } else {
    isLogedIn = "false";
  }
  try {


    const women1 = await Product.find({ For: "Women" ,status:"Active"}).limit(4)
    const women2 = await Product.find({ For: "Women" ,status:"Active"}).skip(4).limit(4)

    const men1 = await Product.find({ For: "Men",status:"Active" }).limit(4)
    const men2 = await Product.find({ For: "Men",status:"Active" }).skip(4).limit(4)


    const banner = await Banner.find({ status: "display" })

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.render("costa", { women1, women2, men1, men2, banner, isLogedIn })

  } catch (error) {
    console.log(error.message);
  }

}

const loadLoginPage = (req, res) => { 
  if (req.session.isAuth) {
    res.redirect('/user/homepage')
  } else {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.render('userLogin')
  }
}

const tempstore = async (req, res) => {

  const { firstname, lastname, password, email } = req.body;

  const emailExist = await Users.findOne({ email: email });

  if (emailExist) {
    const errordata = 'Email already registered';
    return res.render('signup', { errordata });
  } else {
    try {
      req.session.user = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      };
    } catch (error) {
      console.log(error.message);
    }

    res.redirect('/user/sendotp');
  }
};

const userLogout = (req, res) => {
  req.session.destroy();
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.redirect('/user/login')
}


const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};



let OTPassword;
const sendOTP = async (req, res) => {
  const phone = req.body.phone
  const countryCode = req.body.countryCode
  const mobile = countryCode + phone

  const MobExist = await Users.findOne({ mobile: mobile });

  if (MobExist) {
    const errordata = 'Mobile already registered';
    return res.render('sendotp', { errordata });
  } else {
    req.session.user.mobile = mobile;
    OTPassword = generateOTP();

    client.messages
      .create({
        body: `Your OTP for login COSTa is: ${OTPassword}`,
        from: '++14177886255',
        to: mobile,
      })
      .then((message) => {
        res.redirect('/user/verifyotp');
      })
      .catch((error) => {
        console.log('Error sending OTP:', error);
        res.render('sendotp', { errordata: 'Failed to send OTP' });
      });
  }
};


const verifyOTP = (req, res) => {
  const receivedOTP = req.body.otp;

  if (receivedOTP === OTPassword) {
    insertUser(req, res);
  } else {
    const errordata = 'Invalid OTP';
    res.render('verifyotp', { errordata });
  }
};

const insertUser = async (req, res) => {
  const newUser = req.session.user;
  const email = newUser.email
  try {
    const spassword = await securePassword(newUser.password);

    const user = Users({
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      mobile: newUser.mobile,
      password: spassword,
    });

    const result = await user.save();

    const userdata = await Users.findOne({ email: email });

    req.session.userId = userdata._id
    req.session.isAuth = "true"

    res.redirect('/user/homepage');
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userdata = await Users.findOne({ email: email });

    if (userdata) {
      if (userdata.status === "Active") {
        const passwordMatch = await bcrypt.compare(password, userdata.password);
        if (passwordMatch) {
          req.session.userId = userdata._id
          req.session.isAuth = "true"
          console.log(req.session.userId);
          res.redirect('/user/homepage');
        } else {
          res.render('userLogin', { message: 'Invalid password' });
        }
      } else {
        res.render('userLogin', { message: 'Account blocked. Contact customer support' });
      }
    } else {
      res.render('userLogin', { message: 'Username not found' });
    }
  } catch (error) {
    res.render('userLogin', { message: 'Error in login to Costa. Try again...' });
  }
};

const loadUserlist = async (req, res) => {
  const users = await Users.find({})

  res.render('admin-customers', { users })
}

const loadAdduser = async (req, res) => {
  res.render('addUser')
}

const saveUser = async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body
  try {
    const spassword = await securePassword(password)

    const user = new Users({
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      password: spassword
    })
    await user.save()
    res.redirect('/admin/listUsers')
  } catch (error) {
    console.log(error);
  }
}


const loadEditUser = async (req, res) => {
  const id = req.session.userId

  const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(id) })

  res.render('editUser', { user })
}

const updateUser = async (req, res) => {
  const { firstname, lastname, email, mobile, password, id } = req.body
  const spassword = await securePassword(password)


  await Users.updateOne({ _id: new mongoose.Types.ObjectId(id) },
    { $set: { firstname: firstname, lastname: lastname, email: email, mobile: mobile, password: spassword } })


  res.redirect("/admin/listUsers")
}
const updateStatus = async (req, res) => {
  const { id, status } = req.body

  await Users.updateOne({ _id: new mongoose.Types.ObjectId(id) },
    { $set: { status: status } })


  res.redirect("/admin/listUsers")
}


const loadUserProfile = async (req, res) => {

  const id = req.session.userId;

  const orders = await Order.find({ user: new mongoose.Types.ObjectId(id) }).populate('cart.product').sort({ createdAt: -1 })

  res.render('UserProfile', { orders })

}

const loadPersonalInfo = async (req, res) => {

  const id = req.session.userId

  const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(id) })

  res.render('personalDetails', { user })


}
const loadAddressBook = async (req, res) => {
  const id = req.session.userId;

  const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(id) });

  let address = [];
  if (user.address.length !== 0) {
    address = user.address;
  }

  res.render('addressBook', { address });
};



const addAddress = async (req, res) => {

  const id = req.session.userId

  const { name, mobile, locality, buildingname, landmark, city, state, pincode, addressType } = req.body

  const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(id) })

  try {

    user.address.push({
      name: name,
      mobile: mobile,
      locality: locality,
      buildingName: buildingname,
      landmark: landmark,
      city: city,
      state: state,
      pincode: pincode,

      addressType: addressType
    });
    await user.save()

    res.redirect('/user/profile/addressBook')

  } catch (error) {

    console.log(error.message);
  }

}
const addAddressFromCheckout = async (req, res) => {
  const id = req.session.userId;
  const {
    name,
    mobile,
    locality,
    buildingname,
    landmark,
    city,
    state,
    pincode,
    addressType,
  } = req.body;

  try {
    const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate("cart.product");

    user.address.push({
      name: name,
      mobile: mobile,
      locality: locality,
      buildingName: buildingname,
      landmark: landmark,
      city: city,
      state: state,
      pincode: pincode,
      addressType: addressType,
    });
    await user.save();


    res.redirect('/home/cart/selectAddress')
  } catch (error) {
    console.log(error.message);
  }
};





const updateAddress = async (req, res) => {

  const { name, mobile, locality, buildingname, landmark, city, state, pincode, addressType, id } = req.body

  const userid = req.session.userId
  try {

    await Users.updateOne(
      { _id: new mongoose.Types.ObjectId(userid), 'address._id': new mongoose.Types.ObjectId(id) },
      {
        $set: {
          'address.$.name': name,
          'address.$.mobile': mobile,
          'address.$.locality': locality,
          'address.$.buildingname': buildingname,
          'address.$.landmark': landmark,
          'address.$.district': city,
          'address.$.state': state,
          'address.$.pincode': pincode,
          'address.$.addressType': addressType,

        }
      }
    );
    res.redirect('/user/profile/addressBook');
  } catch (error) {
    console.log(error.message);
  }
};


const deleteAddress = async (req, res) => {
  const id = req.body.id;
  const userid = req.session.userId

  try {
    const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(userid) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Users.updateOne(
      { _id: new mongoose.Types.ObjectId(userid) },
      { $pull: { address: { _id: new mongoose.Types.ObjectId(id) } } }
    );

    res.redirect('/user/profile/addressBook');
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const updatePersonalInfo = async (req, res) => {
  const { firstname, lastname, gender } = req.body;
  const userid = req.session.userId
   try {
    await Users.updateOne({ _id: new mongoose.Types.ObjectId(userid) }, { $set: { firstname: firstname, lastname: lastname, gender: gender } });
    res.redirect('/user/profile/personalInfo');

  } catch (error) {
    console.log(error);
  }

}

const changeEmail = async (req, res) => {
  const userid = req.session.userId
  const { newmail, curPassword } = req.body;

  try {
    const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(userid) });

    if (!user) {

      return res.json({ success: false, message: "Invalid email address" });
    }

    const passwordMatch = await bcrypt.compare(curPassword, user.password);

    if (passwordMatch) {

      await Users.updateOne({ _id: new mongoose.Types.ObjectId(userid) }, { $set: { email: newmail } });

      return res.json({ success: true, message: "Email changed successfully" });

    } else {
      // Incorrect password
      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "An error occurred" });
  }
}

const changePwd = async (req, res) => {
  const { currentPwd, newPwd, confirmPwd } = req.body;
  const userid = req.session.userId

  try {
    const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(userid) });

    if (!user) {
      return res.json({ success: false, message: "An Error occured,Please Login Agian" });
    }

    const passwordMatch = await bcrypt.compare(currentPwd, user.password);
    if (passwordMatch) {
      if (newPwd !== confirmPwd) {
        return res.json({ success: false, message: "Passwords do not match" });
      }

      const newPassword = await securePassword(newPwd);
      await Users.updateOne({ _id: new mongoose.Types.ObjectId(userid) }, { $set: { password: newPassword } });

      return res.json({ success: true, message: "Password changed successfully" });
    } else {

      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: "An error occurred" });
  }
};





let forgotPwdOTP
const forgotPwdSendOtp = async (req, res) => {
  const userid = req.session.userId;
  const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(userid) });
  const phoneNumber = user.mobile;

  forgotPwdOTP = generateOTP();

  client.messages
    .create({
      body: `Your OTP to change password is: ${forgotPwdOTP}`,
      from: '++14177886255',
      to: phoneNumber
    })
    .then(message => {
      res.json({ success: true });
    })
    .catch(error => {
      console.error(error.message);
      res.json({ success: false });
    });
};

const verifyPwdOtp = (req, res) => {

  const otp = req.body.otp
  if (otp === forgotPwdOTP) {

    res.json({ success: true })
  } else {

    res.json({ success: false });
  }
}

const updateForgotPwd = async (req, res) => {


  const { newPassword, confirmPassword } = req.body

  const userid = req.session.userId;

  if (newPassword !== confirmPassword) {

    res.json({ success: false })
  } else {
    try {

      const user = await Users.findOne({ _id: new mongoose.Types.ObjectId(userid) })

      const spassword = await securePassword(newPassword)

      await Users.updateOne({ _id: new mongoose.Types.ObjectId(userid) }, { $set: { password: spassword } })

      res.json({ success: true })

    }
    catch (error) {
      console.log(error.message);
      res.json({ success: false })
    }
  }
}

let changeNumOTP
let newPhone
const newNumSendOtp = async (req, res) => {
  const { mobile } = req.body;
  const phoneNumber = mobile;
  newPhone = mobile;
  changeNumOTP = generateOTP();
  client.messages
    .create({
      body: `Your OTP to Change Phone Number is: ${changeNumOTP}`,
      from: '++14177886255',
      to: phoneNumber
    })
    .then(message => {
      res.json({ success: true });
    })
    .catch(error => {
      console.error(error.message);
      res.json({ success: false });
    });

}


const verifyChangePhoneOtp = async (req, res) => {
  const otp = req.body.otp
  console.log(otp);
  try {
    if (otp === changeNumOTP) {

      const userid = req.session.userId

      await Users.updateOne({ _id: new mongoose.Types.ObjectId(userid) }, { $set: { mobile: newPhone } });

      res.json({ success: true });

    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
}

const loadOrderDetails = async (req, res) => {

  const orderId = req.query.orderId

  const order = await Order.findOne({ orderId }).populate('cart.product')

  res.render('orderDetails', { order })
}

const cancelOrder = async (req, res) => {
  const userid = req.session.userId;
  const { orderId, refundMode } = req.body;

  try {
    await Order.updateOne({ orderId: orderId }, { $set: { status: "Cancelled" } });

    if (refundMode === "wallet") {
      const cancelledOrder = await Order.findOne({ orderId: orderId });

      if (cancelledOrder) {
        const walletbalance = cancelledOrder.broughtPrice;

        await Users.updateOne(
          { _id: new mongoose.Types.ObjectId(userid) },
          { $inc: { wallet: walletbalance } }
        );
      }
    }

    const order = await Order.findOne({ orderId }).populate('cart.product');
    res.render('orderDetails', { order });
  } catch (error) {
    console.log(error);
  }
};


const cancelCodOrder=async(req,res)=>{
console.log(req.body);
  const {orderId ,cartId}= req.body

  try {
    await Order.updateOne(
      {
        orderId: orderId,
        'cart._id':new mongoose.Types.ObjectId(cartId)
      },
      {
        $set: {
          'cart.$.status': 'Cancelled'
        }
      }
    );
    


    const order = await Order.findOne({ orderId:orderId}).populate('cart.product');
  
    res.render('orderDetails', { order });
  } catch (error) {
    console.log(error);
  }


}



const cancelWalletOrder=async(req,res)=>{
 
    const {orderId ,cartId}= req.body
  
    try {
      await Order.updateOne(
        {
          orderId: orderId,
          'cart._id':new mongoose.Types.ObjectId(cartId)
        },
        {
          $set: {
            'cart.$.status': 'Cancelled'
          }
        }
      );
      const orderprice = await Order.findOne(
        {
          orderId: orderId,
          'cart._id': new mongoose.Types.ObjectId(cartId)
        },
        {
          'cart.broughtPrice': 1
        }
      );
      
    const broughtPrice=orderprice.cart[0].broughtPrice
     console.log(orderprice);
     console.log(broughtPrice);

      const userid=req.session.userId

      const user=await Users.findOne({_id:new mongoose.Types.ObjectId(userid)})

      user.wallet+=Number(broughtPrice)
      await user.save()
      const order = await Order.findOne({ orderId:orderId}).populate('cart.product');
    
      res.render('orderDetails', { order });
    } catch (error) {
      console.log(error);
    }
  
  
  }
  


const loadWallet=async(req,res)=>{

  const userid=req.session.userId

  const user=await Users.findOne({_id:new mongoose.Types.ObjectId(userid)})

  const walletBalance=user.wallet


  res.render('wallet',{walletBalance}) 

}


const loadOrdersList = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 })

    res.render('admin-orders', { orders });

  } catch (error) {
    console.log(error.message);
  }
}


const editOrderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body
  try {
    await Order.updateOne({ orderId }, { $set: { status: orderStatus } });

    res.redirect('/admin/orders');

  } catch (error) {
    console.log(error);
  }


}
const loadorderView = async (req, res) => {
  const orderId = req.query.orderId

  const order = await Order.findOne({ orderId }).populate('cart.product').populate("user")




  res.render('adminOrderView', { order })
}







let userforgotPwdOTP
let UserMobile
const userForgotPassword = async (req, res) => {

  const UserMobile = req.body.mobile
  const user = await Users.findOne({ mobile: UserMobile })
  if (!user) {
    res.json({ success: false, message: "Please Enter a Registered Phone Number" })
  } else {


    console.log(UserMobile);
    userforgotPwdOTP = generateOTP();

    client.messages
      .create({
        body: `Your OTP to change password is: ${userforgotPwdOTP}`,
        from: '++14177886255',
        to: UserMobile
      })
      .then(message => {
        res.json({ success: true });
      })
      .catch(error => {
        console.error(error.message);
        res.json({ success: false });
      });
  }
};

const verifyOtpUserForgot = (req, res) => {

  const otp = req.body.otp
  if (otp === userforgotPwdOTP) {

    res.json({ success: true })
  } else {

    res.json({ success: false });
  }
}

const updateUserForgotPwd = async (req, res) => {


  const { newPassword, confirmPassword } = req.body



  if (newPassword !== confirmPassword) {

    res.json({ success: false })
  } else {
    try {

      const spassword = await securePassword(newPassword)

      await Users.updateOne({ mobile: UserMobile }, { $set: { password: spassword } })

      res.json({ success: true })

    }
    catch (error) {
      console.log(error.message);
      res.json({ success: false })
    }
  }
}


const downloadInvoice=async(req,res)=>{


  try{

  const orderId=req.query.orderId
  const order=await Order.findOne({orderId:orderId}).populate('cart.product') 
  const products=[]

for(let i=0;i<order.cart.length;i++){
 const productDetails= {

    "quantity": order.cart[i].quantity,
    "description": order.cart[i].product.description,
 
    "price": order.cart[i].broughtPrice,   
   
}
 products.push(productDetails)
}

  const data = {

    "client": { 

      "company": order.shippingAddress.name,
      "address":  order.shippingAddress.buildingName,
      "zip":  order.shippingAddress.pincode,
      "city": order.shippingAddress.city,
      "country":  order.shippingAddress.state,
    },

    // Now let's add our own sender details
    "sender": {
        "company": "COSTA fashions PVT LTD",
        "address": "Sample Street 123",
        "zip": "683594",
        "city": "Kochi",
        "country": "India"
    },


    // Let's add some standard invoice data, like invoice number, date and due-date
    "information": {
      // Invoice number
      "number": order.orderId,
      // Invoice data
      "date": order.createdAt,
      // Invoice due date
      
  },
"products": products,
  
"bottom-notice": "This is a computer generated invoice.It doesnt require a physical signature",
    "settings": {
        "currency": "INR", 
        "tax-notation": "gst"// See documentation 'Locales and Currency' for more info. Leave empty for no currency.
        /* 
         "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')         
         "tax-notation": "gst", // Defaults to 'vat'
         // Using margin we can regulate how much white space we would like to have from the edges of our invoice
         "margin-top": 25, // Defaults to '25'
         "margin-right": 25, // Defaults to '25'
         "margin-left": 25, // Defaults to '25'
         "margin-bottom": 25, // Defaults to '25'
         "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
         "height": "1000px", // allowed units: mm, cm, in, px
         "width": "500px", // allowed units: mm, cm, in, px
         "orientation": "landscape", // portrait or landscape, defaults to portrait         
         */
    },
 
    /*
        Last but not least, the translate parameter.
        Used for translating the invoice to your preferred language.
        Defaults to English. Below example is translated to Dutch.
        We will not use translate in this sample to keep our samples readable.
     */
  

    /*
        Customize enables you to provide your own templates.
        Please review the documentation for instructions and examples.
        Leave this option blank to use the default template
     */
        customize: {
          template: btoa(customTemplate), 
        },
};
  
   
let file="Costa_"+order.orderId+".pdf"

easyinvoice.createInvoice(data, function (result) {
  // Set the appropriate headers for browser download
  res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
  res.setHeader('Content-Type', 'application/pdf');

  // Send the generated PDF data as response to trigger browser download
  res.send(Buffer.from(result.pdf, 'base64'));
});
} catch (error) {
  // Handle the error here
  console.error("An error occurred:", error);
  res.status(500).send("Internal server error");
}

}


const loadWishlist=async(req,res)=>{
  const userId = req.session.userId



  const user= await Users.findOne({_id:new mongoose.Types.ObjectId(userId)}).populate('wishlist.product')
  const wishlist=user.wishlist
 
  res.render('wishlist',{wishlist})
}



module.exports = {
  loadUserSignup,
  tempstore,
  loadSendOtp,
  sendOTP,
  loadVerifyOtp,
  loadHomepage,
  loadLoginPage,
  verifyLogin,
  insertUser,
  verifyOTP,
  securePassword,
  loadUserlist,
  loadAdduser,
  saveUser,
  loadEditUser,
  updateUser,
  userLogout,
  updateStatus,
  loadUserProfile,
  loadPersonalInfo,
  loadAddressBook,
  addAddress,
  updateAddress,
  deleteAddress,
  updatePersonalInfo,
  changeEmail, 
  changePwd,
  forgotPwdSendOtp,
  verifyPwdOtp,
  updateForgotPwd,
  newNumSendOtp,
  verifyChangePhoneOtp,
  loadOrderDetails,
  cancelOrder,
  loadOrdersList,
  editOrderStatus,
  addAddressFromCheckout,
  loadorderView,
  userForgotPassword,
  verifyOtpUserForgot,
  updateUserForgotPwd,
  downloadInvoice,
  loadWishlist,
  loadWallet,
  cancelCodOrder,
  cancelWalletOrder
}
