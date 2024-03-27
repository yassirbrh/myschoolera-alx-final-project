const asyncHandler = require('express-async-handler');

const authAdminProtect = asyncHandler(async (req, res, next) => {
    const admin = req.cookies.admin;

    if (!admin || admin !== 'director') {
        res.status(401).json({ error: 'Only director allowed !!'})
    }
    next();
});

module.exports = authAdminProtect;