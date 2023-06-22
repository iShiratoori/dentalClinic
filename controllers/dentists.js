const Dentist = require('../models/dentists')
const Patient = require('../models/patients');
const User = require('../models/users');

const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0);
};

const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
};

const calendar = {
    month_names,
    isLeapYear,
    getFebDays,
    generateCalendar: ({ month, year }) => {
        const days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const currDate = new Date();

        if (!month) month = currDate.getMonth();
        if (!year) year = currDate.getFullYear();

        const first_day = new Date(year, month, 1);
        const result = {
            currentDay: '',
            currentMonth: month_names[month],
            months: month_names,
            year: year,
            days: []
        };

        for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
            result.days.push(i - first_day.getDay() + 1);
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                result.currentDay = i;
            }
        }

        return result;
    }
};

module.exports.index = (req, res, next) => {
    const user = User.findById(req.user._id).populate('linkageData')
    const { generateCalendar } = calendar;
    const date = generateCalendar({ month: 0, year: 2023 }); // Generate calendar for January 2023
    res.render('dashboard/dentist/index', { date, user })
}

module.exports.appointments = catchAsync(async (req, res, next) => {
    const dentist = await Dentist.findById(req.user.linkageData).populate({
        path: 'appointments', populate: {
            path: 'patient',
        }
    })
    res.render('dashboard/dentist/appointments', { dentist })
});

module.exports.patients = catchAsync(async (req, res, next) => {
    const dentist = await Dentist.findById(req.user.linkageData).populate('patients')
    res.render('dashboard/dentist/patients/index', { dentist })
});

module.exports.payments = (req, res) => {
    res.render('dashboard/dentist/appointments')
}