const { Router } = require('express');
const router = Router();
const userController=require('../controllers/userController');
const productController=require('../controllers/productController')
const autMiddleware=require('../controllers/authMiddleware')



router.get('/homepage',userController.loadHomepage)

router.get('/signup',userController.loadUserSignup)

router.post('/signup',userController.tempstore);

router.get('/sendotp',userController.loadSendOtp);

router.post('/sendotp',userController.sendOTP);

router.get('/verifyotp',userController.loadVerifyOtp);

router.post('/verifyotp',userController.verifyOTP);

router.get('/login',userController.loadLoginPage);

router.post('/login',userController.verifyLogin)

router.get('/logout',userController.userLogout);

router.get('/profile',autMiddleware.isLoggedIn,userController.loadUserProfile); 

router.get('/profile/personalInfo',autMiddleware.isLoggedIn,userController.loadPersonalInfo);

router.get('/profile/addressBook',autMiddleware.isLoggedIn,userController.loadAddressBook);

router.post('/profile/addressBook/addAddress',autMiddleware.isLoggedIn,userController.addAddress);

router.post('/profile/addressBook/addAddressFromCheckout',autMiddleware.isLoggedIn,userController.addAddressFromCheckout);

router.post('/profile/addressBook/updateAddress',autMiddleware.isLoggedIn,autMiddleware.isLoggedIn,userController.updateAddress);

router.post('/profile/addressBook/deleteAddress',autMiddleware.isLoggedIn,userController.deleteAddress);

router.post('/profile/personalInfo/updateInfo',autMiddleware.isLoggedIn,userController.updatePersonalInfo);

router.post('/profile/personalInfo/changeEmail',autMiddleware.isLoggedIn,userController.changeEmail);

router.post('/profile/personalInfo/changePwd',autMiddleware.isLoggedIn,userController.changePwd);

router.post('/profile/personalInfo/forgotPwd/sendOtp',userController.forgotPwdSendOtp);

router.post('/profile/personalInfo/forgotPwd/verifyOtp',userController.verifyPwdOtp);

router.post('/profile/personalInfo/forgotPwd/updatePwd',userController.updateForgotPwd);

router.post('/profile/personalInfo/changeNum/newNumSendOtp',userController.newNumSendOtp);

router.post('/profile/personalInfo/changeNum/verifyChangePhoneOtp',userController.verifyChangePhoneOtp);

router.get('/profile/orderDetails',autMiddleware.isLoggedIn,autMiddleware.isLoggedIn,userController.loadOrderDetails)

router.post('/profile/orderDetails/cancelOrder',autMiddleware.isLoggedIn,userController.cancelOrder)

router.post('/profile/orderDetails/cancelCodOrder',autMiddleware.isLoggedIn,userController.cancelCodOrder)

router.post('/profile/orderDetails/cancelWalletOrder',autMiddleware.isLoggedIn,userController.cancelWalletOrder)

router.post('/userForgotPassword',userController.userForgotPassword);

router.post('/verifyOtpUserForgot',userController.verifyOtpUserForgot);

router.post('/updateUserForgotPwd',userController.updateUserForgotPwd);

router.get('/order/downloadInvoice',autMiddleware.isLoggedIn,userController.downloadInvoice)

router.get('/profile/wallet',autMiddleware.isLoggedIn,userController.loadWallet);





module.exports=router;