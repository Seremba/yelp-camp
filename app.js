const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const Campground = require('./models/campground');
const  methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const catchAsyncError = require('./utils/catchAsyncError');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Databse Connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));




const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {

    res.render('home');
});

app.use('/campgrounds', campgrounds); // campground routes, check in routes/campgrounds.js

app.post('/campgrounds/:id/reviews', validateReview, catchAsyncError(async (req, res) => {
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

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsyncError(async (req, res) => {

    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //pull removes from an array, according to a condn
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
})















app.listen(3000, () => {
    console.log('App Listening On Port 3000');
});
