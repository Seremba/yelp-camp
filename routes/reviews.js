const express = require('express');
const router = express.Router({mergeParams: true});

const Review = require('../models/review');
const Campground = require('../models/campground');

const ExpressError = require('../utils/ExpressError');
const catchAsyncError = require('../utils/catchAsyncError');

const {reviewSchema} = require('../Schemas');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsyncError(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    // create a new review
    const review = new Review(req.body.review);
    // push the review to the campground
    campground.reviews.push(review);
    //save review
    await review.save();
    //save campground
    await campground.save();
    //redirect to the show page
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsyncError(async (req, res) => {

    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //pull removes from an array, according to a condn
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;