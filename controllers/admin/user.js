const Patient = require('../../models/patients');
const Dentist = require('../../models/dentists')
const User = require('../../models/users')
const ExpressError = require('../../utils/expressError');
const catchAsync = require('../../utils/catchAsync');

//index
const all = catchAsync(async (req, res) => {
    const users = await User.find({})
    res.render('dashboard/admin/users/index', { users })
})

//render editing user form
const edit = catchAsync(async (req, res, next) => {
    const { userId } = req.params
    const roles = ['Admin', 'Patient', 'Dentist', 'Guest']
    const user = await User.findById(userId).populate('linkageData')
    if (!user) {
        const message = {
            title: 'User Not Found',
            text: 'Sorry the user that you are looking is not found in database.'
        };
        throw next(new ExpressError(message, 404));
    }
    res.render('dashboard/admin/users/edit', { user, roles })
});

//update user info
const linToData = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { r } = req.params
    const { dentistId, patientId, roles } = req.body.user;
    const user = await User.findById(userId)

    if (!user) {
        const msg = ({
            title: 'Not Found User',
            text: 'failed to link user to patient cause the id you have given does not exit in user database'
        });
        throw next(new ExpressError(msg, 404));
    }
    if (patientId) {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            const msg = ({
                title: 'Not found patient',
                text: 'failed to link user to patient cause the id you have given does not exit in patient database'
            });
            throw next(new ExpressError(msg, 404));
        }
        if (user.isAssociated || patient.isAssociated) {
            const msg = ({
                title: 'Already linked',
                text: 'The user you are trying to link a patient profile  already linked'
            });
            throw next(new ExpressError(msg, 400));
        }

        user.linkageData = patient._id;
        user.linkageModel = 'Patient';
        patient.profile = user;
        await patient.save();
    }
    if (dentistId) {
        const dentist = await Dentist.findById(dentistId);
        if (!dentist) {
            const msg = ({
                title: 'Not found dentist',
                text: 'failed to link user to dentist cause the id you have given does not exit in dentist database'
            });
            throw next(new ExpressError(msg, 404));
        }
        if (user.isAssociated || dentist.isAssociated) {
            const msg = ({
                title: 'Already linked',
                text: 'The user you are trying to link a dentist profile  already linked'
            });
            throw next(new ExpressError(msg, 400));
        }

        user.linkageData = dentist._id;
        user.linkageModel = 'Dentist';
        dentist.profile = user;
        await dentist.save();
    }


    roles.forEach((role, i) => {
        if (!user.findRole(role)) {
            user.assignRoleToUser = role;
            user.definePermissions()
        }
    })
    await user.save();
    req.flash('success', `User ${userId} was successfully assigned data`)
    res.redirect(`/admin/dashboard/users/${user._id}`)
});
const unlinkData = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('linkageData')
    if (!user) {
        const msg = ({
            title: 'Not Found User',
            text: 'failed to link user to patient cause the id you have given does not exit in user database'
        });
        throw next(new ExpressError(msg, 404));
    }
    if (!user.linkageData) {
        const msg = ({
            title: 'User does not associate data',
            text: 'failed to un-link user with patient data'
        });
        throw next(new ExpressError(msg, 400));
    }
    if (user.linkageModel === 'Patient') {
        await Patient.findByIdAndUpdate(user.linkageData._id, { profile: null });
    }
    if (user.linkageModel === 'Dentist') {
        await Dentist.findByIdAndUpdate(user.linkageData._id, { profile: null });
    }

    user.linkageData = null
    user.linkageModel = null
    await user.save();

    req.flash('success', { title: 'Unlinked Data Successfully', text: `User ${userId} was successfully unlinked data` })
    res.redirect(`/admin/dashboard/users/${user._id}`)
});
const deleteD = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId).populate('linkageData');

    if (user.linkageData) {
        if (user.linkageModel === 'Patient') {
            await Patient.findByIdAndUpdate(user.linkageData._id, { profile: null });
        } else if (user.linkageModel === 'Dentist') {
            await Dentist.findByIdAndUpdate(user.linkageData._id, { profile: null });
        }
    }
    req.flash('success', { title: 'Deleted Successfully', text: `user ${userId} has been successfully deleted` })
    res.redirect('/admin/dashboard/users')

});

const revokepermision = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('linkageData')
    // console.log('Before', user.hasPermission)
    if (!user) {
        const msg = ({
            title: 'Not found',
            text: 'Sorrry user was not found'
        });
        throw next(new ExpressError(msg, 400));
    }
    const { Role } = req.query
    if (user.findRole(Role)) {
        user.removeRole(Role)

        if (user.linkageData) {
            if (user.linkageModel === 'Patient' && Role === 'Patient') {
                if (user === 'Patient') {
                    user.removeRole('Patient')
                    const patient = await Patient.findById(user.linkageData._id)
                    patient.profile = null;
                    user.linkageData = null
                    user.linkageModel = null
                    await patient.save()
                }
            } else if (user.linkageModel === 'Dentist' && Role === 'Dentist') {
                user.removeRole('Dentist')
                const dentist = await Dentist.findById(user.linkageData._id)
                dentist.profile = null;
                user.linkageData = null
                user.linkageModel = null
                await dentist.save();
            }
        }
    } else {
        const msg = ({
            title: 'Not Found',
            text: 'User Does not have the role you want to remove'
        })
        throw next(new ExpressError(msg, 404))
    }
    // console.log('After', user.hasPermission)

    await user.save()
    req.flash('success', { title: 'Permission Revokted', text: `User ${userId} was successfully revokted persmission` })
    res.redirect('/admin/dashboard/users')
});


module.exports.user = {
    all,
    edit,
    linToData,
    unlinkData,
    deleteD,
    revokepermision
}