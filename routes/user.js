const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const userController = require('../controller/user');

router.get('/status', isAuth, userController.getStatus);
router.put('/status', isAuth, [
    body('status').trim().notEmpty(),
], userController.updateStatus);

module.exports = router;