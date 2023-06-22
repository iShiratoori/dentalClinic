const ExpressError = require('../utils/expressError');

const { patientSchema, dentistSchema, userSchema, AppointmentSchema } = require('./Schema');

module.exports.validatePatient = (req, res, next) => {
    const { error } = patientSchema.validate(req.body);
    if (error) {
        const msg = ({
            title: 'Back end Validator Error',
            text: error.details.map(el => el.message).join(',')
        })
        // const [url, queryParams] = req.originalUrl.split('?');
        // const method = req.method;
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateDentist = (req, res, next) => {
    const { error } = dentistSchema.validate(req.body);
    if (error) {
        console.log(req.body.dentist.dob)
        const msg = ({
            title: 'Back end Validator Error',
            text: error.details.map(el => el.message).join(',')
        })
        // const [url, queryParams] = req.originalUrl.split('?');
        // const method = req.method;
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateAppointment = (req, res, next) => {
    const { error } = AppointmentSchema.validate(req.body);
    if (error) {
        const msg = ({
            title: 'Back end Validator Error',
            text: error.details.map(el => el.message).join(',')
        })
        // const [url, queryParams] = req.originalUrl.split('?');
        // const method = req.method;
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = ({
            title: 'Back end Validator Error',
            text: error.details.map(el => el.message).join(',')
        })
        // const [url, queryParams] = req.originalUrl.split('?');
        // const method = req.method;
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}