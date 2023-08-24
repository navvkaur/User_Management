const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const tokenverification = require('../../../middleware/jwt')
const Upload = require('../../../middleware/upload');

router.post('/login',userController.login);
// router.post('/resetpassword',tokenverification.decodeToken,userController.resetPassword)
router.get('/users',tokenverification.decodeToken,userController.getUsers)
// router.post('/changepassword',tokenverification.decodeToken,userController.changepassword)
// router.post('/logout',tokenverification.decodeToken,userController.logout)
// router.post('/forgotPassword',userController.forgotPassword)
// router.post('/reset-password/:id',userController.resetpassword)
router.patch('/register/:id',tokenverification.decodeToken,Upload.uploadImage,userController.updateProfile)

module.exports = router;
