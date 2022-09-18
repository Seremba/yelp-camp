const express = require('express');
const router = express.Router({mergeParams: true});

const reviews = require('../controllers/reviews');

const Review = require('../models/review');
const Campground = require('../models/campground');

const catchAsyncError = require('../utils/catchAsyncError');


const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')



router.post('/', isLoggedIn,validateReview, catchAsyncError(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsyncError(reviews.deleteReview));

module.exports = router;
