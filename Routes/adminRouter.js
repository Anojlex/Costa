const { Router } = require('express');
const router = Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const adminController = require('../controllers/adminController');


router.get('/', adminController.loadAdminLogin);

router.post('/login', adminController.verifyLogin);

router.get('/logout', adminController.adminlogout);

router.get('/verifyOtp', adminController.loadVerifyOtp);

router.post('/verifyOtp', adminController.adminverifyOTP);

router.get('/dashboard', adminController.loadDashboard);

router.get('/categories', categoryController.loadListCategory);

router.get('/addCategory', categoryController.loadAddCategory);

router.post('/addCategory', categoryController.addCategory);

router.get('/editCategory', categoryController.loadEditCategory);

router.post('/editCategory', categoryController.updateCategory);

router.get('/deleteCategory', categoryController.deleteCategory);

router.get('/listProducts', productController.loadProductList);

router.get('/editProduct', productController.loadEditproduct);

router.post('/editProduct', productController.uploadMultiple, productController.updateProduct);

router.get('/deleteProduct', productController.deleteProduct);

router.get('/addProduct', productController.loadAddProduct);

router.post('/addProduct', productController.uploadMultiple, productController.saveProduct);

router.get('/listUsers', userController.loadUserlist);

router.post('/editUser', userController.loadEditUser);

router.post('/updateUser', userController.updateUser);

router.get('/addUser', userController.loadAdduser);

router.post('/addUser', userController.saveUser);

router.post('/userStatus', userController.updateStatus);

router.get('/orders', userController.loadOrdersList);

router.post('/orders/editOrderStatus', userController.editOrderStatus);

router.get('/orders/orderView', userController.loadorderView)

router.get('/coupons', adminController.loadAdminCouponlist);

router.post('/addCoupon', adminController.addCoupon);

router.get('/blockCoupon', adminController.blockCoupon);

router.get('/unblockCoupon', adminController.unblockCoupon);

router.get('/deleteCoupon', adminController.deleteCoupon);

router.get('/banners', adminController.loadBanners);

router.post('/banners', adminController.uploadMultiple, adminController.saveBanner);

router.get('/deleteBanner', adminController.deleteBanner);

router.get('/activateBanner', adminController.activateBanner);

router.get('/hideBanner', adminController.hideBanner);

router.post('/salesReport',adminController.loadSalesReport)

router.post('/monthlySales',adminController.loadmonthlySales)

router.post('/chartType',adminController.loadDifferentCharts)


module.exports = router


