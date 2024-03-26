import studentController from '../controllers/studentController';
import authProtect from '../middlewares/authMiddleware';

const express = require('express');
const router = express.Router();

router.get('/getgrades', authProtect, studentController.getGrades);
router.get('/getcourses', authProtect, studentController.getCourses);

module.exports = router;
