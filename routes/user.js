const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware')

//controllers
const userController = require('../controllers/user');


router.get('/signup', userController.signupForm)

router.post('/signup', wrapAsync(userController.signUp))

router.get('/login', userController.loginForm)

router.post(
    '/login',
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.login
);


router.get('/logout', userController.logOut)


module.exports = router;