const express = require('express');
const User = require('../models/users')
const { isLogged, } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.use(isLogged)

router.get('/', catchAsync(async (req, res, next) => {
    const users = await User.find({})
    res.render('partials/messages', { users })
}));

module.exports = router