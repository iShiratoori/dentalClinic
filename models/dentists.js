const mongoose = require('mongoose');
const Appointment = require('./appointments')
const addressSchema = require('./address');
const dateSchema = require('./utils/date');
const { cloudinary } = require('../cloudinary');
const { Schema } = mongoose
const dentistSchema = new Schema({
    name: {
        title: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    dob: {
        type: dateSchema,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    specialization: {
        type: String,
        required: [true, 'Specilization type is required']
    },
    address: [addressSchema],
    image: {
        public_id: {
            type: String,
            required: [true, 'image public id failed to get'],
        },
        url: {
            type: String,
            required: [true, 'failed to get image url'],
        },
    },
    contacts: {
        phone: {
            type: String,
            require: [true, 'Contact number is required']
        },
        email: {
            type: String,
            require: [true, 'Contact Email/Mail is required']
        }
    },
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    patients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Patient'
        }
    ],
    search: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

dentistSchema.methods.getFullName = function () {
    return `${this.name.title} ${this.name.firstName} ${this.name.lastName}`
}
dentistSchema.statics.findByName = async function (dentistName) {
    const namesArray = dentistName.split(' ');
    const title = namesArray[0];
    const firstName = namesArray[1];
    // const middleName = namesArray[1];
    const lastName = namesArray[2];
    const name = ({
        title: title,
        firstName: firstName,
        lastName: lastName
    })

    try {
        const dentist = await this.findOne({
            name: name
        })
        if (!dentist) {
            return null;
        }

        return dentist;
    } catch (error) {
        console.error('Error finding dentist:', error);
        throw error;
    }
};

dentistSchema.virtual('isAssociated').get(function () {
    if (!this.profile) {
        return false;
    }
    return true;
})


dentistSchema.pre('save', async function () {
    this.search = `${this.name.firstName} ${this.name.lastName}`
})

dentistSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await cloudinary.deleteFile(doc.image.public_id)
        await Appointment.deleteMany({
            _id: {
                $in: doc.appointments
            }
        })
    }
})

module.exports = mongoose.model('Dentist', dentistSchema);
