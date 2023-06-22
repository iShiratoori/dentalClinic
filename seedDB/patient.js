const Patient = require('../models/patients');
const file = require('./p')

const seedDB = async () => {
    await Patient.deleteMany();
    for (let i = 0; i < file.length; ++i) {
        const patient = Patient(file[i])
        await patient.save();
    }

}

module.exports = seedDB