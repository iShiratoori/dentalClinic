const User = require('../models/users');
const { cloudinary } = require('../cloudinary')
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');

module.exports.renderlogin = (req, res) => {
    res.render('users/login')
}
module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.create = catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body.user;
    const user = new User({ email, username });
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
    user.image.public_id = result.public_id;
    user.image.url = result.url;
    const newAccout = await User.register(user, password);
    res.redirect('/login')
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