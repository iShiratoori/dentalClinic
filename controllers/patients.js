const Patient = require('../models/patients');
const Dentist = require('../models/dentists')
const User = require('../models/users');
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')

module.exports.index = async (req, res, next) => {
    res.render('dashboard/index')
}

module.exports.dentist = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('linkageData')
    const patient = await Patient.findById(user.linkageData._id).populate('dentist')
    res.render('dashboard/patient/dentist', { patient })
});
module.exports.appointments = (req, res) => {
    res.render('dashboard/patient/appointments')
}
module.exports.payments = (req, res) => {
    res.render('dashboard/patient/appointments')
}