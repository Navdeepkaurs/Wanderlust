const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js') // errors
const ExpressError = require('../utils/expressErrors.js');
const Listing = require('../models/listing.js')
const { listingSchema, reviewSchema } = require('../schema.js')
const { isLoggedIn } = require('../middleware.js')
const { isOwner, validateListing } = require('../middleware.js')
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })


//controler
const listingController = require('../controllers/listings.js');


// to display all listings
router.get('/', wrapAsync(listingController.index))

//new listing and create Route
router.get('/new', isLoggedIn, listingController.renderNewForm)

router.post('/', isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.createListings))



//show route
router.get('/:id', wrapAsync(listingController.showListings))


//update & Edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

router.patch('/:id', isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing));



//delete listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

module.exports = router;