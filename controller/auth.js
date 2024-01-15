const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists')
            error.statusCode = 400;
            throw error;
        }

        const inputPass = await bcrypt.hash(password, 12);

        const user = await new User({
            email,
            password: inputPass,
            name,
        }).save();

        const response = {message: 'User created', userId: user._id}

        res.status(201).json(response)

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            const error = new Error('Email not registered')
            error.statusCode = 401;
            throw error;
        }

        const isEqual = bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error('Invalid User');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            }, 
            'secret', 
            { expiresIn: '1h'}
        );
        res.status(200).json({ token, userId: user._id.toString() })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}