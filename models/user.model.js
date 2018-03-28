
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    school: { type: String, required: true },
    isApproved: { type: Boolean, required: true },
    phoneNumber: { type: String },
    homeAddress: { type: String, required: true },
    password: {
        type: String,
        required: true,
    },

});


UserSchema.pre('save', function userPreSave(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        return bcrypt.hash(user.password, 10)
            .then((hash) => {
                user.password = hash;
                return next();
            })
            .catch(err => next(err));
    }
    return next();
});


UserSchema.plugin(uniqueValidator);

UserSchema.methods.comparePassword = function userComparePassword(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
