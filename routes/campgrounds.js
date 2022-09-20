const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsyncError = require('../utils/catchAsyncError');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const {storage} = require('../cloudinary')
const multer  = require('multer');
const upload = multer({storage});


router.route('/')
    .get(catchAsyncError(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsyncError(campgrounds.createCampground));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('It Worked!!')
    })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get( catchAsyncError(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsyncError(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsyncError(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(campgrounds.renderEditForm));



module.exports = router;
