import teacherController from '../controllers/teacherController';
import authTeacherProtect from '../middlewares/authTeacherMiddleware';

const express = require('express');
const router = express.Router();

router.get('/getgrades', authTeacherProtect, teacherController.getGrades);
router.get('/getcourses', authTeacherProtect, teacherController.getCourses);
router.post('/addgrades', authTeacherProtect, teacherController.addGrades);
router.post('/addfile', authTeacherProtect, teacherController.addFile);

module.exports = router;