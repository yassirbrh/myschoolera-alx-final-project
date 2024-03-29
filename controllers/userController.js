import Teacher from '../models/teacherModel';
import Student from '../models/studentModel';
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const { userName, birthDate, position, photo, gender } = req.body;

    if (!firstName || !lastName || !email || !password || !userName || !birthDate || !gender) {
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
            password, birthDate, photo, gender, schoolSubject
        });
        if (user) {
            const { _id, firstName, lastName, userName, email, birthDate, gender, schoolSubject } = user;
            res.status(201).json({
                _id, firstName, lastName, userName, email, birthDate, gender, schoolSubject
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
            password, birthDate, photo, gender, gradeLevel
        });
        if (user) {
            const { _id, firstName, lastName, userName, email, birthDate, gender, gradeLevel } = user;
            res.status(201).json({
                _id, firstName, lastName, userName, email, birthDate, gender, gradeLevel
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
                secure: false
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
                secure: false
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
        secure: false
    });
    return res.status(200).json({ message: "Logged out !!"});
});

const getUser = asyncHandler(async (req, res) => {
    if (req.user) {
        const userAttributes = Object.keys(req.user).reduce((obj, key) => {
            if (key !== '_id') {
                obj[key] = req.user[key];
            }
            return obj;
          }, {});
        res.status(200).json(userAttributes);
    } else {
        res.status(400);
        throw new Error("User Not Found");
    }
});

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
});

const updateUser = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.user._id);
    const student = await Student.findById(req.user._id);
    let user;

    const allowedAttributes = ['firstName', 'lastName', 'photo', 'email', 'birthDate'];
  
    if (!teacher && !student) {
      console.log(req.user._id);
      res.status(404);
      throw new Error("User not found");
    } else if (teacher) {
        user = teacher;
    } else if (student) {
        user = student;
    }
    allowedAttributes.forEach(attribute => {
        if (req.body[attribute] !== undefined) {
            user[attribute] = req.body[attribute];
        }
    });
  
    const updatedUser = await user.save();

    res.status(200).json({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      photo: updatedUser.photo,
      birthDate: updatedUser.birthDate
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.user._id);
    const student = await Student.findById(req.user._id);
    let user;
  
    if (!teacher && !student) {
      res.status(400);
      throw new Error("User not found, please signup");
    }
  
    if (teacher) {
      user = teacher;
    } else if (student) {
      user = student;
    }
  
    const { oldPassword, password } = req.body;
  
    // Validate
    if (!oldPassword || !password) {
      res.status(400);
      throw new Error("Please add old and new password");
    }
  
    // Check if old password matches password in DB
    const passwordIsCorrect = await bcryptjs.compare(oldPassword, user.password);
  
    // Save new password
    if (passwordIsCorrect) {
      user.password = password;
      await user.save();
      res.status(200).send("Password change successful");
    } else {
      res.status(400);
      throw new Error("Old password is incorrect");
    }
});
  

module.exports = { 
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword
};