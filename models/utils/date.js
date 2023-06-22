const mongoose = require('mongoose');
const { Schema } = mongoose
const dateSchema = new Schema({
    date: {
        type: Date,
        required: true
    }
});

dateSchema.methods.getDay = function () {
    const dayOfMonth = this.date.getDate().toString().padStart(2, '0');
    return dayOfMonth;
}
dateSchema.methods.getMonth = function () {
    const monthOfyear = (this.date.getMonth() + 1).toString().padStart(2, '0');
    return monthOfyear;
}
dateSchema.methods.getYear = function () {
    yearofBirth = this.date.getFullYear().toString();
    return yearofBirth;
}

dateSchema.methods.getAge = function () {
    const ageInMilliseconds = Date.now() - this.date
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    return ageInYears
}

dateSchema.methods.fullDate = function (format = '/') {
    const formattedDate = `${this.getDay()}${format}${this.getMonth()}${format}${this.getYear()}`;
    return formattedDate
}
dateSchema.methods.getFormatedDate = function (arg1) {
    const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = month_names[this.getMonth() - 1].substring(0, 3);

    if (arg1 === 'm') {
        return `${this.getDay()} ${month}, ${this.getYear()}`;
    } else if (arg1 === 'd') {
        return `${month} ${this.getDay()}, ${this.getYear()}`;
    } else {
        return 'You are passing this function the wrong arguments.';
    }
}
//for input feilds
dateSchema.methods.getReverseDate = function (arg1) {
    const patientDOB = this.getYear() + '-' + this.getMonth() + '-' + this.getDay();
    return patientDOB
}



module.exports = dateSchema