const ExpressError = require('../utils/expressError');
const User = require('../models/users')
const multer = require('multer')
const { cloudinary } = require('../cloudinary')


module.exports.isLinkedData = (req, res, next) => {
    if (!req.user.linkageData) {
        const msg = ({
            title: 'Sorry Not linked Data',
            text: 'This user you are using is not linked with data please ask admin for futher explanation.'
        })

        throw next(new ExpressError(msg, 404))
    }
    next();
}

module.exports.isLogged = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }

    // Check if the user is verified
    const user = await User.findById(req.user._id).populate('verification');
    if (!user.isVerified()) {
        return res.redirect('/verify/email');
    }

    next();
};


module.exports.isAdmin = (req, res, next) => {
    if (!req.user.findRole('Admin')) {
        const msg = ({
            title: 'Forbidden',
            text: 'You are not allowed to access this page'
        })
        throw new ExpressError(msg, 403)
    }
    next();
}

module.exports.checkPermissions = (role, permissions) => {
    return (req, res, next) => {
        if (!req.user.hasPermission.some(permission => permission.role === role)) {
            const msg = {
                title: 'Forbidden',
                text: 'You are not allowed to access this page.'
            };
            throw new ExpressError(msg, 403);
        }

        const userPermissions = req.user.hasPermission.find(permission => permission.role === role).permissions;
        for (let permission of permissions) {
            if (!userPermissions.includes(permission)) {
                const msg = {
                    title: 'Unauthorized',
                    text: 'You are not authorized to access this page.'
                };
                throw new ExpressError(msg, 401);
            }
        }

        next();
    };
};


module.exports.uploadImageCloudTemporary = (path) => {
    const upload = multer({ storage: cloudinary.createfolder(path) })
    console.log(path)
    return upload.single('profileImage')
}