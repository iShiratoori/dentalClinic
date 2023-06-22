// const seedDB = require('./dentist');
const seedDB = require('./patient');
// const seedDB = require('./upcomingappointment');
const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dentalClinic';
mongoose.connect(dbUrl);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



seedDB();

