const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    // create a new review
    const review = new Review(req.body.review);
    // associate review to the author
    review.author = req.user._id;
    // push the review to the campground
    campground.reviews.push(review);
    //save review
    await review.save();
    //save campground
    await campground.save();
    //redirect to the show page
    req.flash('success', 'Successfully Created a New Review!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //pull removes from an array, according to a condn
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted Review!')
    res.redirect(`/campgrounds/${id}`);
}
