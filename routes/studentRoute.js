import studentController from '../controllers/studentController';
import authStudentProtect from '../middlewares/authStudentMiddleware';

const express = require('express');
const router = express.Router();

router.get('/getgrades', authStudentProtect, studentController.getGrades);
router.get('/getcourses', authStudentProtect, studentController.getCourses);

module.exports = router;
