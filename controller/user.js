const { validationResult } = require('express-validator')

const User = require('../models/user');

exports.getStatus = async (req, res, next) => {
    
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            message: 'success',
            code: 'SUCCESS',
            status: user.status,
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect');
            error.statusCode = 422
            throw error;
        }

        const { status } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        user.status = status;
        user.save();
        
        return res.status(200).json({
            message: 'User updated',
            code: 'SUCCESS',
        })
    } catch(err) {
        next(err)
    }
}