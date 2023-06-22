const mongoose = require('mongoose');
const { Schema } = mongoose

const addressSchema = new Schema({
    addressL1: {
        type: String,
        required: [true, 'address line 1 is required']
    },
    addressL2: String,

    postCode: {
        type: String,
        set: (value) => {
            // Capitalize all letters in the name
            return value.toUpperCase();
        },
        required: [true, 'Post code is required']
    },
    country: {
        type: String,
        required: [true, 'country must be provited']
    }
})


addressSchema.virtual('getFullAddress').get(function () {
    const address = this.addressL1 + this.addressL2 + ', ' + this.postCode + ', ' + this.country
    return address;
});


module.exports = addressSchema