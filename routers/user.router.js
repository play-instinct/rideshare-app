const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');
const disableWithToken = require('../middlewares/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middlewares/requiredFields.middleware');
const errorsParser = require('../helpers/errorsParser.helper');

require('../strategy/jwt.strategy')(passport);

// Create API group routes
const router = express.Router();

router.route('/users')
    .post(disableWithToken, requiredFields('email', 'username', 'password'), (req, res) => {
        User.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        })
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        res.status(200).json(req.user);
    });

router.route('/users/:id')
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {
        User.findById(req.params.id)
        .populate('friends', 'username email')
        .then(user => res.json({ user }));
    });


router.post('/login', disableWithToken, requiredFields('email', 'password'), (req, res) => {
    User.findOne({ email: req.body.email })
    .then((foundResult) => {
        if (!foundResult) {
            return res.status(400).json({
                generalMessage: 'Email or password is incorrect',
            });
        }
        return foundResult;
    })
    .then((foundUser) => {
        foundUser.comparePassword(req.body.password)
        .then((comparingResult) => {
            if (!comparingResult) {
                return res.status(400).json({
                    generalMessage: 'Email or password is incorrect',
                });
            }
            const tokenPayload = {
                _id: foundUser._id,
                email: foundUser.email,
                username: foundUser.username,
                role: foundUser.role,
            };
            const token = jwt.sign(tokenPayload, config.SECRET, {
                expiresIn: config.EXPIRATION,
            });
            return res.json({ token: `Bearer ${token}` });
        });
    })
    .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
});

module.exports = { router };
