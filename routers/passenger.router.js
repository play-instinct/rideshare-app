const express = require('express');
const Passenger = require('../models/passenger.model');
const errorsParser = require('../helpers/errorsParser.helper');
const requiredFields = require('../middlewares/requiredFields.middleware');
const passport = require('passport');
// Create API group routes
const router = express.Router();

router.route('/passenger')
    .post(passport.authenticate('jwt', { session: false }), requiredFields('name', 'email', 'school', 'homeAddress'), (req, res) => {
        Passenger.create({
            name: req.body.name,
            email: req.body.email,
            school: req.body.school,
            phoneNumber: req.body.phoneNumber,
            homeAddress: req.body.homeAddress,

        })
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Passenger.find()
        .then(passengers => res.json(passengers));
    });

router.route('/passenger/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Passenger.findById(req.params.id)
        .then(passenger => res.json(passenger));
    });


module.exports = { router };
