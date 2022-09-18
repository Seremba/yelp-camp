const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')


router.get('/', catchAsyncError(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsyncError(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', 'Successfully Created a New Campground!')
        res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id',  isLoggedIn, isAuthor, validateCampground, catchAsyncError(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully Updated A Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsyncError(async (req, res) => {
    const {id} = req.params;
    await  Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;
