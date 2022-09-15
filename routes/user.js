const express = require('express');
const router = express.Router();
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

module.exports = router;
