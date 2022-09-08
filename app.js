const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const Campground = require('./models/campground');
const  methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const catchAsyncError = require('./utils/catchAsyncError');


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

app.get('/', (req, res) => {

    res.render('home');
});

app.get('/campgrounds', catchAsyncError(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', catchAsyncError(async (req, res, next) => {
        // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
        const campgroundSchema = Joi.object({
            campground: Joi.object({
                title: Joi.string().required(),
                image: Joi.string().required(),
                price: Joi.number().required(),
                location: Joi.string().required(),
                description: Joi.string().required()
            }).required()
        });
        const { error } = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        }
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/:id/edit', catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

app.put('/campgrounds/:id', catchAsyncError(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsyncError(async (req, res) => {
    const {id} = req.params;
    await  Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
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
