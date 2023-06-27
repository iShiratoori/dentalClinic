const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationSchema = new Schema({
    code: {
        type: String,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 24 * 60 * 60 * 1000 // 1 day in milliseconds
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    }
});
verificationSchema.methods.verifyUser = function (code) {
    if (this.code !== code) {
        return false;
    }
    this.verified = true;
    this.code = null // i am sure why i am ressting to null;
    this.expiresAt = null // i am sure why i am ressting to null;
    return this.save();
};
module.exports = mongoose.model('Verification', verificationSchema);
