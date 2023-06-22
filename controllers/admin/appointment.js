const Patient = require('../../models/patients');
const Dentist = require('../../models/dentists')
const Appointment = require('../../models/appointments')
const ExpressError = require('../../utils/expressError');
const catchAsync = require('../../utils/catchAsync');

//index
const all = catchAsync(async (req, res, next) => {
    const appointments = await Appointment.find({}).populate('patient').populate('dentist')
    res.render('dashboard/admin/appointments/index', { appointments })
});

//render appointment registeration form
const renderAppointmentPage = catchAsync(async (req, res) => {
    const { patientId } = req.params
    if (!patientId) {
        const patient = null
        res.render('dashboard/admin/appointments/new', { patient })
    } else {
        const patient = await Patient.findById(patientId).populate('dentist');
        res.render('dashboard/admin/appointments/new', { patient });
    }
});

//create appointment
const create = catchAsync(async (req, res, next) => {
    const { appointment } = req.body;
    const patient = await Patient.findByName(appointment.patient.name)
    const dentist = await Dentist.findByName(appointment.dentist.name)
    if (!patient) {
        throw next(new ExpressError('NOT FOUND PAITENT'));
    } if (!dentist) {
        throw next(new ExpressError('NOT FOUND DENTIST'));
    }
    const newAppointment = Appointment({
        date: appointment.date,
        time: appointment.time,
        patient: patient._id,
        dentist: dentist._id,
        status: appointment.status,
        type: appointment.type
    })
    patient.appointments.push(newAppointment);
    dentist.appointments.push(newAppointment);
    await newAppointment.save();
    await patient.save();
    await dentist.save();
    res.redirect('/admin/dashboard/appointments')
})

//redning Edit appointment form
const edit = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    Appointmentstatus = ['failed', 'due', 'attended'];
    const appointment = await Appointment.findById(appointmentId).populate('patient').populate('dentist')
    res.render('dashboard/admin/appointments/edit', { appointment, Appointmentstatus })
});

//update appointment
const update = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { appointment } = req.body;
    const patient = await Patient.findByName(appointment.patient.name)
    const dentist = await Dentist.findByName(appointment.dentist.name)

    if (!patient) {
        throw next(new ExpressError('NOT FOUND PAITENT'));
    } if (!dentist) {
        throw next(new ExpressError('NOT FOUND DENTIST'));
    }
    await Appointment.findByIdAndUpdate(appointmentId, {
        date: appointment.date,
        time: appointment.time,
        patient: patient._id,
        dentist: dentist._id,
        status: appointment.status,
        type: appointment.type
    })
    res.redirect('/admin/dashboard/appointments')
});

//delete appointment
const deleteApp = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const app = await Appointment.findByIdAndDelete(appointmentId).populate('patient').populate('dentist')
    if (app) {
        await Patient.findByIdAndUpdate(
            app.patient._id,
            { $pull: { appointments: { $in: app._id } } }
        );
        await Dentist.findByIdAndUpdate(
            app.dentist._id,
            { $pull: { appointments: { $in: app._id } } }
        );
    }
    res.redirect('/admin/dashboard/appointments')
})


module.exports.appointment = {
    all,
    renderAppointmentPage,
    create,
    edit,
    update,
    deleteApp,
}