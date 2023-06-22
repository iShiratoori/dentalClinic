const UpcommingAppointment = require('../models/upcomingAppointment')
const Patient = require('../models/patients')
const Appointment = require('../models/appointments')

const seedDB = async () => {
    const upcoming = await Appointment.find({
        date: {
            $gte: new Date().setHours(0, 0, 0, 0)
        }
    }).sort({ date: 1 }).populate('patient')

    let today = [], tomorrow = [];
    const currentDate = new Date();
    const day = currentDate.getDate();
    upcoming.forEach((appointment, i) => {
        if (appointment.getAppointmentDay > day) {
            tomorrow.push({
                patient_name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                appointment_date: appointment.date,
                appointment_time: appointment.time,
                action: 'Upcoming'
            });
        } else if (appointment.getAppointmentDay === day) {
            today.push({
                patient_name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                appointment_date: appointment.date,
                appointment_time: appointment.time,
                action: 'Today'
            });
        }
    })
    const upcommingAppointments = UpcommingAppointment({
        today: today,
        tomorrow: tomorrow,
    })
    await upcommingAppointments.save();
}

module.exports = seedDB;