const Dentist = require('../models/dentists');
const file = require('./d')

const seedDB = async () => {
    await Dentist.deleteMany();
    for (let i = 0; i < file.length; ++i) {
        const dentist = Dentist(file[i])
        await dentist.save();
    }

}

module.exports = seedDB