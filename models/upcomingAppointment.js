const mongoose = require('mongoose');
const { Schema } = mongoose
// Define the Mongoose schema for Appointments

const todaySchema = new Schema({
    patient_ticket: {
        type: String,
    },
    patient_name: {
        type: String,
        required: true
    },
    appointment_date: {
        type: Date,
        required: true
    },
    appointment_time: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['Today', 'Next', 'Pending', 'In Progress', 'Done'],
        required: true
    }
});

const tomorrowSchema = new Schema({
    patient_ticket: {
        type: String,
    },
    patient_name: {
        type: String,
        required: true
    },
    appointment_date: {
        type: Date,
        required: true
    },
    appointment_time: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['Upcoming'],
        required: true
    }
});

todaySchema.virtual('getTime').get(function () {
    const [hour, minute] = this.appointment_time.split(':').map(Number);
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
})
tomorrowSchema.virtual('getTime').get(function () {
    const [hour, minute] = this.appointment_time.split(':').map(Number);
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
})

todaySchema.virtual('getDate').get(function () {
    const currTime = this.appointment_date;
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = currTime.toLocaleDateString('en-US', dateOptions);
    return formattedDate
})

tomorrowSchema.virtual('getDate').get(function () {
    const currTime = this.appointment_date;
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = currTime.toLocaleDateString('en-US', dateOptions);
    return formattedDate
})


const upcomingAppointmentSchema = new Schema({
    today: [todaySchema],
    tomorrow: [tomorrowSchema]
});

upcomingAppointmentSchema.pre('save', async function () {
    this.today.sort((a, b) => {
        const [hoursA, minutesA] = a.appointment_time.split(':');
        const [hoursB, minutesB] = b.appointment_time.split(':');

        if (hoursA === hoursB) {
            return minutesA - minutesB;
        }

        return hoursA - hoursB;
    });

    this.tomorrow.sort((a, b) => {
        const [hoursA, minutesA] = a.appointment_time.split(':');
        const [hoursB, minutesB] = b.appointment_time.split(':');

        if (hoursA === hoursB) {
            return minutesA - minutesB;
        }

        return hoursA - hoursB;
    });

    const patientTicket = this.today.length + this.tomorrow.length;
    let k = 0;
    for (let i = 0; i < this.today.length; i++) {
        this.today[i].patient_ticket = `#${i + 1}`;
        ++k
    }
    for (let i = 0; i < this.tomorrow.length; i++) {
        this.tomorrow[i].patient_ticket = `#${i + 1 + k}`;
    }
})
upcomingAppointmentSchema.methods.findByTicket = function (ticket) {
    let found;
    for (let p of this.today) {
        if (p.patient_ticket === ticket) {
            found = p;
            break;
        }
    }
    if (!found) {
        return null;
    }
    else {
        return found;
    }
};
module.exports = mongoose.model('Upcoming-Appointment', upcomingAppointmentSchema);
