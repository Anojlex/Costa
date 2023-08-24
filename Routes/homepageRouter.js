const { Router } = require('express');
const router = Router();
const userController=require('../controllers/userController');


router.get('/',userController.loadHomepage)


module.exports=router;   