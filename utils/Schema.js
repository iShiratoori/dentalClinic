const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.patientSchema = Joi.object({
    patient: Joi.object({
        name: Joi.object({
            title: Joi.string().required().escapeHTML(),
            firstName: Joi.string().required().escapeHTML(),
            lastName: Joi.string().required().escapeHTML(),
        }).required(),
        dob: Joi.object({
            date: Joi.date().required()
        }),
        gender: Joi.string().required().escapeHTML(),
        image: Joi.object({
            public_id: Joi.string().allow('').optional().escapeHTML(),
            url: Joi.string().required().escapeHTML(),
        }),
        contacts: Joi.object({
            phone: Joi.string().required().escapeHTML(),
            email: Joi.string().required().escapeHTML(),
        }).required(),
        address: Joi.object({
            addressL1: Joi.string().required().escapeHTML(),
            addressL2: Joi.string().allow('').optional().escapeHTML(),
            postCode: Joi.string().required().escapeHTML(),
            country: Joi.string().required().escapeHTML(),
        }).required()
    }).required(),
});

module.exports.dentistSchema = Joi.object({
    dentist: Joi.object({
        name: Joi.object({
            title: Joi.string().required().escapeHTML(),
            firstName: Joi.string().required().escapeHTML(),
            lastName: Joi.string().required().escapeHTML(),
        }).required(),
        dob: Joi.object({
            date: Joi.date().required()
        }),
        gender: Joi.string().required().escapeHTML(),
        specialization: Joi.string().required().escapeHTML(),
        image: Joi.object({
            public_id: Joi.string().allow('').optional().escapeHTML(),
            url: Joi.string().required().escapeHTML(),
        }),
        contacts: Joi.object({
            phone: Joi.string().required().escapeHTML(),
            email: Joi.string().required().escapeHTML(),
        }).required(),
        address: Joi.object({
            addressL1: Joi.string().required().escapeHTML(),
            addressL2: Joi.string().allow('').optional().escapeHTML(),
            postCode: Joi.string().required().escapeHTML(),
            country: Joi.string().required().escapeHTML(),
        }).required(),
    }).required(),
})

module.exports.AppointmentSchema = Joi.object({
    appointment: Joi.object({
        date: Joi.date().required(),
        time: Joi.string().required().escapeHTML(),
        patient: Joi.object({
            name: Joi.string().required().escapeHTML()
        }).required(),
        dentist: Joi.object({
            name: Joi.string().required().escapeHTML(),
        }).required(),
        status: Joi.string().required().escapeHTML(),
        type: Joi.string().required().escapeHTML(),
    }).required()
})

module.exports.upcomingApointmentSchema = Joi.object({
    upcomingAppointment: Joi.object({
        patient_ticket: Joi.string().required().escapeHTML(),
        patient_name: Joi.string().required().escapeHTML(),
        appointment_date: Joi.date().required(),
        appointment_time: Joi.string().required().escapeHTML(),
        action: Joi.string().required().escapeHTML(),
    }).required()
})
module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().required().escapeHTML(),
        username: Joi.string().required().escapeHTML(),
        password: Joi.string().required().escapeHTML(),
        image: Joi.object({
            public_id: Joi.string().allow('').optional().escapeHTML(),
            url: Joi.string().required().escapeHTML(),
        }),
        linkageData: Joi.string().allow('').optional().escapeHTML(),
        role: Joi.string().allow('').optional().escapeHTML(),
    }).required()
})