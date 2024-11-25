const Listing = require('../models/listing.js')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.createListings = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    console.log(response.body.features[0].geometry)

    let image = {
        url: req.file.path,        // Cloudinary image URL
        filename: req.file.filename // Image filename in Cloudinary
    };

    // Extract other fields from req.body
    let { title, description, price, location, country } = req.body;

    // Create a new listing with the updated schema
    let newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
        owner: req.user._id,
        geometry: response.body.features[0].geometry
    });

    let resp = await newListing.save();
    console.log(resp);
    req.flash("success", "New Listing Added!")
    res.redirect('/listings');
}



module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!list) {
        req.flash("error", "Listing Does not Exist");
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', { list });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing Does not Exist");
        res.redirect('/listings');
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render('listings/edit', { list, originalImageUrl })

}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    // Find the listing by ID
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect('/listings');
    }

    // Update basic properties
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.location = location || listing.location;
    listing.country = country || listing.country;

    // Update image if a new file is uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    console.log('deleted');
    req.flash("success", "Listing Deleted!")
    res.redirect('/listings');

}