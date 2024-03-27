import adminController from '../controllers/adminController';
import authAdminProtect from '../middlewares/authAdminMiddleware';

const express = require('express');
const router = express.Router();

router.post('/login', adminController.loginAdmin);
router.get('/logout', adminController.logoutAdmin);
router.post('/addclass', authAdminProtect, adminController.addClass);
router.get('/getteachers', authAdminProtect, adminController.getTeachers);
router.get('/getstudents', authAdminProtect, adminController.getStudents);
router.get('/getclasses', authAdminProtect, adminController.getClasses);
router.get('/getotherdata', authAdminProtect, adminController.getOtherData);
router.patch('/acceptuser', authAdminProtect, adminController.acceptUser);

module.exports = router;