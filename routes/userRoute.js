import userController from '../controllers/userController';
import authProtect from '../middlewares/authMiddleware';

const express = require('express');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/getuser', authProtect, userController.getUser);
router.get('/loggedin', userController.loginStatus);
router.patch('/updateuser', authProtect, userController.updateUser);
router.patch("/changepassword", authProtect, userController.changePassword);

module.exports = router;
