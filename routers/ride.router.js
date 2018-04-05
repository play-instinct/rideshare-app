const express = require('express');
const Ride = require('../models/ride.model');
const passport = require('passport');
const errorsParser = require('../helpers/errorsParser.helper');
const requiredFields = require('../middlewares/requiredFields.middleware');

const router = express.Router();


router.route('/rides')
    .post(passport.authenticate('jwt', { session: false }), requiredFields('driver', 'seats', 'pickupLocation', 'radius', 'date', 'courtesyTime', 'destination'), (req, res) => {
        Ride.create({
            driver: req.body.driver,
            seats: req.body.seats,
            passengers: req.body.passengers,
            pickupLocation: req.body.phoneNumber,
            radius: req.body.homeAddress,
            date: req.body.date,
            courtesyTime: req.body.courtesyTime,
            note: req.body.note,
            destination: req.body.destination,
            riderDestinations: req.body.riderDestinations,
        })
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Ride.find()
        .then(rides => res.json(rides));
    });

router.route('/rides/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Ride.findById(req.params.id)
        .populate('passengers.passenger', 'name')
        .then(ride => res.json(ride));
    });
router.route('/rides/:id/book')
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Ride.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(ride => res.json(ride));
    });

module.exports = { router };
