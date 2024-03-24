import Teacher from '../models/teacherModel';
import Student from '../models/studentModel';
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const { userName, birthDate, position, photo } = req.body;

    if (!firstName || !lastName || !email || !password || !userName || !birthDate) {
        res.status(400);
        throw new Error("Please fill in all required fields !!");
    }
    const studentEmailExists = await Student.findOne({ email });
    const teacherEmailExists = await Teacher.findOne({ email });
    if (studentEmailExists || teacherEmailExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }
    const studentUsernameExists = await Student.findOne({ userName });
    const teacherUsernameExists = await Teacher.findOne({ userName });
    if (studentUsernameExists || teacherUsernameExists) {
        res.status(400);
        throw new Error("Username has already been registered");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }
    if (position !== 'teacher' && position !== 'student') {
        res.status(400);
        throw new Error("Please fill in the position field (Teacher or Student only) !!");
    } else if (position === 'teacher') {
        const { schoolSubject } = req.body;
        if (!schoolSubject) {
            res.status(400);
            throw new Error("Please fill in the school subject field !!");
        }
        const user = await Teacher.create({
            firstName, lastName, userName, email,
            password, birthDate, photo, schoolSubject
        });
        if (user) {
            const { _id, firstName, lastName, userName, email, birthDate, schoolSubject } = user;
            res.status(201).json({
                _id, firstName, lastName, userName, email, birthDate, schoolSubject
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } else if (position === 'student') {
        const { gradeLevel } = req.body;
        if (!gradeLevel) {
            res.status(400);
            throw new Error("Please fill in the grade level field !!");
        }
        const user = await Student.create({
            firstName, lastName, userName, email,
            password, birthDate, gradeLevel
        });
        if (user) {
            const { _id, firstName, lastName, userName, email, birthDate, gradeLevel } = user;
            res.status(201).json({
                _id, firstName, lastName, userName, email, birthDate, gradeLevel
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    }

});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        res.status(400);
        throw new Error("Please enter a username and password !!");
    }

    const isTeacherUsername = await Teacher.findOne({ userName });
    const isStudentUsername = await Student.findOne({ userName });

    if (isTeacherUsername) {
        const isPasswordCorrect = await bcryptjs.compare(password, isTeacherUsername.password);
        if (!isPasswordCorrect) {
            res.status(400);
            throw new Error("Password incorrect !!");
        } else {
            const { _id, firstName, lastName, userName, email, birthDate, schoolSubject } = isTeacherUsername;
            const token = generateToken(_id);
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400),
                sameSite: "none",
                secure: true
            })
            res.status(200).json({
                _id, firstName, lastName, userName, email, birthDate, schoolSubject, token
            });
        }
    } else if (isStudentUsername) {
        const isPasswordCorrect = await bcryptjs.compare(password, isStudentUsername.password);
        if (!isPasswordCorrect) {
            res.status(400);
            throw new Error("Password incorrect !!");
        } else {
            const { _id, firstName, lastName, userName, email, birthDate, gradeLevel } = isStudentUsername;
            const token = generateToken(_id);
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400),
                sameSite: "none",
                secure: true
            });
            res.status(200).json({
                _id, firstName, lastName, userName, email, birthDate, gradeLevel, token
            });
        }
    } else {
        res.status(400);
        throw new Error('Invalid username !!');
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({ message: "Logged out !!"});
});

module.exports = { registerUser, loginUser, logoutUser };