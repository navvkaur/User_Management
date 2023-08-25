const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const tokenverification = require('../../../middleware/jwt')
const Upload = require('../../../middleware/upload');

router.post('/login',userController.login);
router.get('/users',tokenverification.decodeToken,userController.getUsers)
router.patch('/updateProfile/:id',tokenverification.decodeToken,Upload.uploadImage,userController.updateProfile)
router.post('/register', Upload.uploadImage , userController.addUser)
module.exports = router;
