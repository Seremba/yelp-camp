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
            author: '632394c68b31efd62c9ef2c4',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: `
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla maxime
            molestiae delectus molestias, reprehenderit quae doloremque distinctio
            obcaecati aperiam porro`,
            price,
            geometry: {
              type: 'Point',
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
               ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dy7hpes4w/image/upload/v1663742666/YelpCamp/jmxnck5z5hw3yyfbjhy9.jpg',
                  filename: 'YelpCamp/jmxnck5z5hw3yyfbjhy9',
                },
                {
                  url: 'https://res.cloudinary.com/dy7hpes4w/image/upload/v1663742666/YelpCamp/rrqmojjyxpeystcjsf0g.jpg',
                  filename: 'YelpCamp/rrqmojjyxpeystcjsf0g',
                },
                {
                  url: 'https://res.cloudinary.com/dy7hpes4w/image/upload/v1663742667/YelpCamp/lwxmijgdw64w5eravtbf.jpg',
                  filename: 'YelpCamp/lwxmijgdw64w5eravtbf',
                }
              ]
        });

        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
