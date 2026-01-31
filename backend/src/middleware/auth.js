const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Silakan login terlebih dahulu.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan.',
            });
        }

        if (!req.user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Akun Anda telah dinonaktifkan.',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid.',
        });
    }
};

// Authorize by role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk fitur ini.',
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
