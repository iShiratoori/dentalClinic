const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    dentist: {
        type: Schema.Types.ObjectId,
        ref: 'Dentist',
        required: true
    },
    status: {
        type: String,
        enum: ['failed', 'due', 'attended'],
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

appointmentSchema.virtual('getTime').get(function () {
    const [hour, minute] = this.time.split(':').map(Number);
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
})
appointmentSchema.virtual('getDate').get(function () {
    const currTime = this.date;
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = currTime.toLocaleDateString('en-US', dateOptions);
    return formattedDate
})

appointmentSchema.virtual('getAppointmentDay').get(function () {
    const currTime = this.date;
    const day = currTime.getDate();
    return day;
})


module.exports = mongoose.model('Appointment', appointmentSchema);
