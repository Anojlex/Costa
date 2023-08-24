const multer = require('multer');
const Banner = require('../models/bannerModel')
const fs = require('fs');
const path = require('path');
const Coupon=require('../models/couponModel') 
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const accountSid =  process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const Admin = require('../models/adminModel');
const { default: mongoose } = require('mongoose');
const SalesReport=require('../models/salesReportModel')


 
const loadAdminLogin = (req, res) => {
  res.render('adminLogin')
}

const loadVerifyOtp = (req, res) => {
  res.render('adminVerify')
}

const loadDashboard =async (req, res) => {


 const yearlySales=await SalesReport.aggregate([
    {
      $group: {
        _id: { $year: "$date" },
        totalSales: { $sum: "$totalSales" },
        totalProductCount: { $sum: "$productCount" },
        totalOrderCount: { $sum: "$orderCount" }
      }
    }
  ])
 

  res.render('adminDashboard',{yearlySales})
}

const loadmonthlySales=async(req,res)=>{

  const selectedYear = req.body.selectedYear; 
  try{
  const monthlySales = await SalesReport.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(selectedYear, 0, 1), // Start of the selected year
          $lt: new Date(selectedYear + 1, 0, 1) // Start of the next year
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$date" } },
        totalSales: { $sum: "$totalSales" },
        totalProductCount: { $sum: "$productCount" },
        totalOrderCount: { $sum: "$orderCount" }
      }
    },
    {
      $sort: {
        "_id.month": 1
      }
    }
  ]);
  
 res.json({success:true,monthlySales})


}catch(error){
  res.json({success:false,message:"COULDN'T LOAD REPORT"})
  console.log(error.message);
}


}




const adminlogout = (req, res) => {
  res.redirect('/admin')
}


let OTPassword;

sendOTP = (phoneNumber, res) => {

  OTPassword = generateOTP();
  client.messages
    .create({
      body: `Your OTP for login COSTa is: ${OTPassword}`,
      from: '++14177886255',
      to: phoneNumber
    })
    .then(message => {

      res.redirect('/verifyotp');
    })
    .catch(error => {
      console.error(error.message)

    });
}

const generateOTP = () => {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

verifyOTP = (req, res) => {
  let receivedOTP = req.body.otp
  if (receivedOTP === OTPassword) {
    userController.insertUser

  } else {
    res.redirect('/error-page');
  }
}

let AdminOtp
const adminSendOTP = (phoneNumber, res) => {


  AdminOtp = generateOTP();
  client.messages
    .create({
      body: `Your OTP for login COSTa admin is: ${AdminOtp}`,
      from: '++14177886255',
      to: phoneNumber
    })
    .then(message => {

      res.redirect('/admin/verifyOtp');
    })
    .catch(error => {
      console.error(error.message)

    });
}




const adminverifyOTP = (req, res) => {
  let receivedOTP = req.body.otp
  if (receivedOTP === AdminOtp) {
    req.session.admin = receivedOTP
    res.redirect('/admin/dashboard')

  } else {
    res.render("adminVerify", { message: "Invalid OTP" });
  }

}






const verifyLogin = async (req, res) => {

  try {
    const username = req.body.username;
    const password = req.body.password;

    const admindata = await Admin.findOne({ username: username });

    if (admindata) {
      if (password === admindata.password) {
        const phoneNumber = admindata.mobile
        adminSendOTP(phoneNumber, res)

      } else {

        res.render('adminLogin', { message: 'Incorrect password' });
      }
    }
    else {

      res.render('adminLogin', { message: 'Username not found' });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadAdminCouponlist =async(req, res) => {
 
  const coupons=await Coupon.find({})
  res.render("admin-coupons",{coupons})
}



const loadBanners =async (req, res) => {
 const banners= await Banner.find({}).sort({createdAt:-1})

  res.render("admin-banners",{banners})
}




const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './banners';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

const uploadMultiple = upload.array("images", 4);
const saveBanner = async (req, res) => {
  try {
    const files = req.files; 

    for (const file of files) {
      const image = {
        data: fs.readFileSync(path.join(__dirname, '..', 'banners', file.filename)),
        contentType: file.mimetype,
      };

      const banner = new Banner({
        images: image,
      });

      await banner.save();
    }


    res.redirect('/admin/banners');
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


const deleteBanner=async(req,res)=>{
  const bannerId=req.query.bannerId

   await Banner.findByIdAndDelete(bannerId)
   res.redirect('/admin/banners')


}


const activateBanner=async(req,res)=>{
  const bannerId=req.query.bannerId;
 
  await Banner.updateOne({_id:new mongoose.Types.ObjectId(bannerId)},{$set:{status:"display"}})
  res.redirect('/admin/banners')

}


  const  hideBanner=async(req,res)=>{
  const bannerId=req.query.bannerId;
 
  await Banner.updateOne({_id:new mongoose.Types.ObjectId(bannerId)},{$set:{status:"hidden"}})
  res.redirect('/admin/banners')

}

const addCoupon=async(req,res)=>{

  const{code,percentage,minpurchase,maxAmount,expiry}=req.body
  console.log(req.body);
  
  const exist=await Coupon.findOne({code:code});

  if(exist){
   return  res.json({success:false,message:"Coupon Code Exists!"})
  }
else{
   const coupon= Coupon({
      code:code,
      percentage:percentage,
      minpurchase:minpurchase,
      maxAmount:maxAmount,
      expiry:expiry, 

   });
 
   await coupon.save();
   res.json({success:true}) 
  }
}

const blockCoupon=async(req,res)=>{
const couponId=req.query.couponId
await Coupon.updateOne({_id:new mongoose.Types.ObjectId(couponId)},{$set:{status:"Blocked"}})
res.redirect("/admin/coupons")
}

const unblockCoupon=async(req,res)=>{
  const couponId=req.query.couponId
  await Coupon.updateOne({_id:new mongoose.Types.ObjectId(couponId)},{$set:{status:"Active"}})
  
  res.redirect("/admin/coupons")

}

const deleteCoupon=async(req,res)=>{
  const couponId=req.query.couponId
  await Coupon.findByIdAndDelete({_id:new mongoose.Types.ObjectId(couponId)})
  res.redirect("/admin/coupons")

}
const loadSalesReport = async (req, res) => {

  try {
    const startDate = Date.parse(req.body.startDate)
    const endDate = Date.parse(req.body.endDate)


  

      const salesReports = await SalesReport.find({
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      res.status(200).json({ message: 'Sales report loaded successfully', salesReports });
  } catch (error) {
      console.error('Error loading sales report:', error);
      res.status(500).json({ error: 'An error occurred while loading sales report' });
  }
};

const loadDifferentCharts = async (req, res) => {

  try {
  
      const {selectedChart,selectedYear} = req.body

      if (selectedChart === "yearly") {
          
         const yearlyData= await createYearlyChart()
          res.json({ success: true, yearlyData }); 
      }

     else if(selectedChart === "monthly"){

      const monthlyData= await createMonthlyChart(selectedYear)
      res.json({ success: true, monthlyData }); 
     }
    


  } catch (error) {
      console.log(error.message);
      res.json({ success: false });
  }
}


const createYearlyChart=async()=>{
  const yearlyData = await SalesReport.aggregate([
    {
        $group: {
            _id: { $year: "$date" },
            totalSales: { $sum: "$totalSales" },
            productCount: { $sum: "$productCount" },
            orderCount: { $sum: "$orderCount" }
        }
    },
    {
        $sort: { _id: 1 } // Sort by year in ascending order
    }
]);

return yearlyData
}

const createMonthlyChart = async (selectedYear) => {

  const monthlyData = await SalesReport.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $year: "$date" },parseInt(selectedYear, 10)]
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        totalSales: { $sum: "$totalSales" },
        productCount: { $sum: "$productCount" },
        orderCount: { $sum: "$orderCount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month in ascending order
    }
  ]);

  return monthlyData;
};



module.exports = {
  verifyLogin,
  loadAdminLogin,
  adminverifyOTP,
  loadVerifyOtp,
  loadDashboard,
  adminlogout,
  loadAdminCouponlist, 
  loadBanners,
  saveBanner,
  uploadMultiple,
  deleteBanner,
  activateBanner,
  hideBanner,
  addCoupon,
  blockCoupon,
  unblockCoupon,
  deleteCoupon,
  loadSalesReport,
  loadmonthlySales,
  loadDifferentCharts,
  
}
