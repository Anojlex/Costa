const { Router } = require('express');
const router = Router();
const productController=require('../controllers/productController');
const cartController=require('../controllers/cartController');
const autMiddleware=require('../controllers/authMiddleware')
const paymentController=require('../controllers/paymentController')
const userController=require('../controllers/userController')

router.get('/singleProduct',productController.showSingleProduct) ;

router.get('/',productController.listProducts);

router.post("/singleProduct/addToCart",cartController.addToCart);

router.post("/singleProduct/addToWishlist",cartController.addToWishlist);

router.get('/cart',autMiddleware.isLoggedIn,cartController.loadCart);

router.get('/wishlist',autMiddleware.isLoggedIn,userController.loadWishlist);
 
router.post('/cart/changeQuantity',autMiddleware.isLoggedIn,cartController.changeQuantity);

router.get('/cart/remove',cartController.removeFromCart);

router.get('/cart/wishlist',cartController.addToWishlistFromCart);

router.post('/wishlist/moveTOCart',autMiddleware.isLoggedIn,cartController.moveToCart);

router.post('/wishlist/removeFromWishlist',autMiddleware.isLoggedIn,cartController.removeFromWishlist);

router.get('/cart/selectaddress',autMiddleware.isLoggedIn,cartController.loadSelectAdress);

router.post('/cart/changeaddress',autMiddleware.isLoggedIn,cartController.updateAddressIndex);

router.get('/cart/proceedPayment',autMiddleware.isLoggedIn,cartController.loadProceedPayment);

router.get('/cart/proceedPayment/placeOrder',autMiddleware.isLoggedIn,cartController.placeOrder);

router.post('/cart/proceedPayment/createRazorpayOrder',autMiddleware.isLoggedIn,paymentController.createRazorpayOrder);

router.post('/cart/proceedPayment/verifyPayment',autMiddleware.isLoggedIn,paymentController.verifyPayment);

router.post('/cart/validate-coupon',cartController.verifyCoupon);

router.post('/filterProducts',productController.filterProducts)

router.post('/search',productController.searchProduct)





module.exports=router