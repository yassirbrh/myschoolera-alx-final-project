import Class from "../models/classModel";
import Teacher from "../models/teacherModel";
import Student from "../models/studentModel";
import OtherData from "../models/otherData";
const asyncHandler = require('express-async-handler');

const loginAdmin = asyncHandler(async (req, res) => {
    const password = req.body.password;

    if (!password) {
        res.status(400).json({ error: 'Please enter a password !!' });
        return;
    }

    // Check if OtherData exists
    let otherData = await OtherData.findOne();

    // If OtherData doesn't exist, create a new object with default values
    if (!otherData) {
        otherData = await OtherData.create({});
    }

    // Retrieve the adminPassword
    const adminPassword = otherData.adminPassword;

    // Check if the provided password matches the adminPassword
    if (password !== adminPassword) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    res.cookie("admin", "director", {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        secure: false
    });
    res.status(200).json({ adminPassword });
});

const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie("admin", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        secure: false
    });
    return res.status(200).json({ message: "Logged out !!"});
});

const addClass = asyncHandler(async (req, res) => {
    const { gradeLevel, gradeClass, studentsList, teachersList } = req.body;

    const newClass = await Class.create({
        gradeLevel, gradeClass, studentsList, teachersList
    });
    if (newClass) {
        res.status(200).json({ message: 'New class created !!'});
    } else {
        res.status(400).json({ message: 'Class not created !!'});
    }
});

const getTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.find();

    res.status(200).json(teachers);
});

const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find();

    res.status(200).json(students);
});

const getClasses = asyncHandler(async (req, res) => {
    const classes = await Class.find();

    res.status(200).json(classes);
});

const getOtherData = asyncHandler(async (req, res) => {
    const otherData = await OtherData.find();

    res.status(200).json(otherData);
});

const acceptUser = asyncHandler(async (req, res) => {
    const { position, userName } = req.body;

    let model;
    if (position === 'teacher') {
        model = Teacher;
    } else if (position === 'student') {
        model = Student;
    } else {
        res.status(400).json({ message: 'Invalid position' });
        return;
    }

    const user = await model.findOne({ userName });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    user.isAccepted = true;
    await user.save();

    res.status(200).json({ message: 'User accepted successfully' });
});


module.exports = {
    loginAdmin,
    logoutAdmin,
    addClass,
    getTeachers,
    getStudents,
    getClasses,
    getOtherData,
    acceptUser
};
