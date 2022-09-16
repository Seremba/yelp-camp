const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsyncError( async (req, res, next) => {
    try{
        const {username, email, password} = req.body;
        const user = await new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash('success','Welcome To Yelp Camp');
            res.redirect('/campgrounds');
        });

    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome back to YelpCamp');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/campgrounds');
    });
  });

module.exports = router;
