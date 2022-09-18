const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsyncError = require('../utils/catchAsyncError');
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')


router.get('/', catchAsyncError(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsyncError(campgrounds.createCampground));

router.get('/:id', catchAsyncError(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(campgrounds.renderEditForm));

router.put('/:id',  isLoggedIn, isAuthor, validateCampground, catchAsyncError(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsyncError(campgrounds.deleteCampground));

module.exports = router;
