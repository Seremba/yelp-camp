const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');
const User = require('../models/user');


router.get('/register', users.renderRegister);

router.post('/register', catchAsyncError( users.register));

router.get('/login', users.renderLogin);

router.post('/login',
passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;
