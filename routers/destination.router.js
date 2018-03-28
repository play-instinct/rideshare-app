const express = require('express');
const Destination = require('../models/destination.model');
const errorsParser = require('../helpers/errorsParser.helper');
const requiredFields = require('../middlewares/requiredFields.middleware');
const passport = require('passport');
// Create API group routes
const router = express.Router();

router.route('/destination')
    .post(passport.authenticate('jwt', { session: false }), requiredFields('lat', 'long', 'address'), (req, res) => {
        Destination.create({
            lat: req.body.lat,
            long: req.body.long,
            address: req.body.address,
        })
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Destination.find()
        .then(destination => res.json(destination));
    });

router.route('/destination/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        Destination.findById(req.params.id)
        .then(destination => res.json(destination));
    });


module.exports = { router };
