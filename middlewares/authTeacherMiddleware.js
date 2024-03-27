import Teacher from '../models/teacherModel';
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authTeacherProtect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new Error('Not authorized, please login !!');
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await Teacher.findById(verified.id).select("-password -__v -isAccepted");

        if (teacher) {
            req.user = teacher._doc;
        } else {
            throw new Error('Only teachers authorized !!');
        }
        next();
    } catch(error) {
        res.status(401);
        throw new Error(error.message);
    }
});

module.exports = authTeacherProtect;
