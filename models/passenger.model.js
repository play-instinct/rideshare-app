const mongoose = require('mongoose');


const PassengerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    school: { type: String, required: true },
    phoneNumber: { type: String },
    homeAddress: { type: String, required: true },

});


const Passenger = mongoose.model('Passenger', PassengerSchema);

module.exports = { Passenger };
