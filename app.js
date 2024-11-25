if (process.env.NODE_ENV != 'production') {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync') // errors
const ExpressError = require('./utils/expressErrors');
const { listingSchema, reviewSchema } = require('./schema.js')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const listingRoute = require('./routes/listings.js');
const reviewRoute = require('./routes/reviews.js')
const userRoute = require('./routes/user.js')



app.use(methodOverride('_method'));
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate);



const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;
//Database Connection
main()
    .then(() => {
        console.log("connection made to Database..")
    })
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
}


//mongoose session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: secret,
    touchAfter: 24 * 60 * 60 // 1 day
})

store.on("err", () => {
    console.log("Error in session store")
})

//express sessions
const sessionOptions = {
    store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week !
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};




//using express sessions
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // initialize passport 
app.use(passport.session()); //checks if same user is making req in all pages 

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})


const Listing = require('./models/listing')
const Review = require('./models/review.js');





//router listings
app.use('/listings', listingRoute);

//router reviews
app.use('/listings/:id/reviews', reviewRoute)

//router reviews
app.use('/', userRoute)




//sending req on any path thats not defined will throw this error 
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Path Not Found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error.ejs', { message })
});





// port start
app.listen(8080, () => {
    console.log('Server is running on port 8080');
})





// //function to validate 
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         throw new ExpressError(400, error)
//     }
//     next();
// }

// //function to validate review
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         throw new ExpressError(400, error)
//     }
//     next();
// }


// // to display all listings
// app.get('/listings', wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render('listings/index.ejs', { allListings });
// }))

// //new listing and create Route
// app.get('/listings/new', (req, res) => {
//     res.render('listings/new.ejs');
// })

// app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
//     let { title, description, image, price, location, country } = req.body;

//     let newListing = new Listing({
//         title: title,
//         description: description,
//         image: image,
//         price: price,
//         location: location,
//         country: country
//     })

//     await newListing.save();

//     res.redirect('/listings');
// }))



// //show route
// app.get('/listings/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const list = await Listing.findById(id).populate('reviews');
//     res.render('listings/show.ejs', { list });
// }))


// //update & Edit route
// app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const list = await Listing.findById(id);
//     res.render('listings/edit', { list })

// }))
// app.patch('/listings/:id', validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const { title, description, image, price, location, country } = req.body;
//     await Listing.findByIdAndUpdate(
//         id,
//         {
//             title: title,
//             description: description,
//             image: image,
//             price: price,
//             location: location,
//             country: country
//         }
//     );
//     res.redirect(`/listings/${id}`);
// }));


// //delete listing
// app.delete('/listings/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);

//     console.log('deleted');
//     res.redirect('/listings');

// }))






// //post request for review 
// app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
//     //get the listing where we will add the review!
//     let listing = await Listing.findById(req.params.id);

//     let newreview = new Review(req.body.review);
//     listing.reviews.push(newreview);

//     await newreview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }))

// //delete a particular review from reviews and listings 
// app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))





