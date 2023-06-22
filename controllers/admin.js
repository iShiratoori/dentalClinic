const Patient = require('../models/patients');
const Dentist = require('../models/dentists')
const Appointment = require('../models/appointments')
const User = require('../models/users')
const UpcommingAppointment = require('../models/upcomingAppointment')
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');

const { dentist } = require('./admin/dentist')
const { patient } = require('./admin/patient')
const { user } = require('./admin/user')
const { appointment } = require('./admin/appointment')

//overview page or dashboard index
module.exports.index = async (req, res) => {
    const { dateAndTime } = res.locals
    const dentists = await Dentist.find({});
    const users = await User.find({})
    const patients = await Patient.find({});
    const usersDetails = {
        unAssotiatedUsers: () => {
            let total = 0;
            users.forEach((user, i) => {
                if (!user.isAssociated) {
                    total += 1;
                }
            })
            return total;
        },
        Admins: () => {
            let total = 0;
            users.forEach((user, i) => {
                if (user.isAdmin) {
                    total += 1;
                }
            })
            return total;
        }
    }
    const upcommingAppointments = await UpcommingAppointment.findOne({})
    res.render('dashboard/index', { dateAndTime, upcommingAppointments, dentists, users, patients, usersDetails })
}

module.exports.dentist = dentist
module.exports.patient = patient
module.exports.user = user
module.exports.appointment = appointment


