const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsyncError = require('../utils/catchAsyncError');
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')

router.route('/')
    .get(catchAsyncError(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsyncError(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get( catchAsyncError(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsyncError(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsyncError(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(campgrounds.renderEditForm));



module.exports = router;
