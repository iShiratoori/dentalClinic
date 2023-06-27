const User = require('../models/users');
const Verification = require('../models/verification');
const { cloudinary } = require('../cloudinary')
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');
const sgMail = require('@sendgrid/mail')
const { VerifyEmailHTML } = require('./verifyEmail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.renderlogin = (req, res) => {
    res.render('users/login')
}
module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.create = catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body.user;
    const user = new User({ email, username, });
    const userVerfi = Verification({
        code: Math.floor(Math.random() * 999999)
    })
    const wherTo = cloudinary.pathTo.user.profile
    let result;
    if (req.file) {
        result = await cloudinary.updateFolder(req.file.path, wherTo)
        await cloudinary.deleteFile(req.file.filename)
    } else {
        if (req.body.user.image.url) {
            const { url } = req.body.user.image
            result = await cloudinary.updateFolder(url, wherTo)
        } else {
            const unknow = 'https://res.cloudinary.com/dm7zftkof/image/upload/v1686965695/dentalClinic/unknow-person_fj6car.jpg'
            result = await cloudinary.updateFolder(unknow, wherTo)
        }
    }
    if (!result.url || !result.public_id) {
        const msg = ({
            title: 'Failed image url or public id',
            text: 'Error to obtain image from the database'
        })
        throw next(new ExpressError(msg, 400))
    }

    //if you registering first then enebale this to register as an admin
    // const allusers = await User.find({})
    // if (!allusers.length) {
    //     user.assignRoleToUser = 'Admin';
    //     user.definePermissions();
    //     console.log(user.hasPermission)
    // }

    user.image.public_id = result.public_id;
    user.image.url = result.url;
    user.verification = userVerfi;
    await userVerfi.save()
    const newAccout = await User.register(user, password);
    res.redirect('/verify/email')
});

module.exports.renderVerificationPage = catchAsync(async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    const user = await User.findById(req.user._id).populate('verification')
    const msg = {
        to: user.email,
        // from: 'yourSenderVerifiedEmail',
        subject: 'Verification Mail',
        html: VerifyEmailHTML(user.verification.code)
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    res.render('users/verification');
});
module.exports.verifyEmail = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login')
    }

    const { code } = req.body
    const user = await User.findById(req.user._id).populate('verification')
    if (!await user.verification.verifyUser(code)) {
        const msg = {
            title: 'Verification Code Failed',
            text: 'Sorry verification code does not match for what we sent '
        }
        throw next(new ExpressError(msg, 400));
    }
    res.redirect(`/${req.user.getDirectory}`);
});

module.exports.login = (req, res) => {
    res.redirect(req.user.getDirectory);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Logout GoodBye!')
        res.redirect('/login')
    });
};