const express = require('express')
const router = express.Router();
const user = require('../controllers/users')
const { uploadImageCloudTemporary } = require('../utils/middleware')
const { validateUser } = require('../utils/validations')
const passport = require('passport');


router.route('/login')
    .get(user.renderlogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), user.login)

router.route('/register')
    .get(user.register)
    .post(validateUser, uploadImageCloudTemporary('dentalClinic/temporary'), user.create)

router.route('/verify/email')
    .get(user.renderVerificationPage)
    .post(user.verifyEmail)

router.route('/logout')
    .get(user.logout)
module.exports = router