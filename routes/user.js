const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsyncError( async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = await new User({username, email});
        const registeredUser = await User.register(user, password);
        req.flash('success','Welcome To Yelp Camp');
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    req.flash('success', 'Welcome back to YelpCamp');
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/campgrounds');
    });
  });

module.exports = router;
