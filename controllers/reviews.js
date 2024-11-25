const Review = require('../models/review.js');
const Listing = require('../models/listing.js')

module.exports.createReview = async (req, res) => {
    //get the listing where we will add the review!
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id; // who adds review 
    listing.reviews.push(newreview);


    await newreview.save();
    await listing.save();
    req.flash("success", "Review Created!")
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`);
}