const mongoose = require('mongoose');
const Appointment = require('./appointments')
const Dentist = require('./dentists')
const dateSchema = require('./utils/date')
const { cloudinary } = require('../cloudinary')
const addressSchema = require('./address')
const { Schema } = mongoose

const patientSchema = new Schema({
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
    address: [addressSchema],
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
    registered: {
        type: Date,
        default: Date.now()

    },
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dentist: {
        type: Schema.Types.ObjectId,
        ref: 'Dentist'
    },
    search: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});


patientSchema.methods.getFullName = function () {
    return `${this.name.title} ${this.name.firstName} ${this.name.lastName}`
}

patientSchema.methods.unlinkProfile = function () {
    if (this.profile) {
        this.profile = null;
        return this.save();
    }
    return Promise.resolve(this);
}


patientSchema.statics.findByName = async function (patientName) {
    const namesArray = patientName.split(' ');
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
        const patient = await this.findOne({
            name: name
        })
        if (!patient) {
            return null;
        }
        return patient;
    } catch (error) {
        console.error('Error finding patients:', error);
        throw error;
    }
};

patientSchema.virtual('isAssociated').get(function () {
    if (!this.profile) {
        return false;
    }
    return true;
})

patientSchema.pre('save', async function () {
    this.search = `${this.name.firstName} ${this.name.lastName}`
})
patientSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await cloudinary.deleteFile(doc.image.public_id)
        if (doc.dentist) {
            await Dentist.findByIdAndUpdate(
                doc.dentist._id,
                { $pull: { patients: { $in: doc._id } } }
            );
        }
        await Appointment.deleteMany({
            _id: {
                $in: doc.appointments
            }
        })
    }
})


module.exports = mongoose.model('Patient', patientSchema);