const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync.js') // errors
const { validateReview, isLoggedIn, isAuthor } = require('../middleware.js');

//controller
const reviewsController = require('../controllers/reviews.js');

//post request for review 
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewsController.createReview))

//delete a particular review from reviews and listings 
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviewsController.destroyReview))

module.exports = router;