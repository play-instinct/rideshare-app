const mongoose = require('mongoose');


const RideSchema = mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    passengers: [
       { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
    ],
    seats: {
        type: Number,
        required: true,
    },
    pickupLocation: {
        lat: { type: String },
        long: { type: String },
        note: { type: String },
    },
    radius: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    courtesyTime: {
        type: Number,
        required: true,

    },
    note: {
        type: String,
    },
    destination: {
        lat: { type: String, required: true },
        long: { type: String, required: true },
    },
    riderDestinations: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    ],
});


const Ride = mongoose.model('Ride', RideSchema);

module.exports = { Ride };
