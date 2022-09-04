const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Databse Connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {

    res.render('home');
});

app.get('/create-campground', async (req, res) => {
    let camp = new Campground({title: 'Nansana Camp', description: 'The most perfect place'});
    await camp.save();
    res.send(camp);
});

app.listen(3000, () => {
    console.log('App Listening On Port 3000');
});
