const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsyncError( users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;
