const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Databse Connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
   await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10000);
        // console.log(random1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla maxime molestiae delectus molestias, reprehenderit quae doloremque distinctio obcaecati aperiam porro. Repudiandae eos rem id odio quo corporis eveniet obcaecati ullam
            laboriosam quod mollitia, facilis nulla modi, veniam dignissimos quibusdam. Veritatis provident consequatur nisi voluptatem rerum, unde eligendi. Natus at veritatis ut`,
            price

        });

        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
