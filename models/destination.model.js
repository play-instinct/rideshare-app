const mongoose = require('mongoose');

const DestinationSchema = mongoose.Schema({
    lat: { type: String, required: true },
    long: { type: String, required: true },
    address: { type: String, required: true },
}, {
    timestamps: true,
});

const Destination = mongoose.model('Destination', DestinationSchema);

module.exports = { Destination };
