const User = require('../models/user')

module.exports.signupForm = (req, res) => {
    res.render('users/signup.ejs')
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email, username
        })

        const reg = await User.register(newUser, password);
        console.log(reg);
        req.login(reg, err => {
            if (err) {
                console.log(err);
                return next(err)
            }
            req.flash("success", "User Registered!");
            res.redirect('/listings');
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/users/signup');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to WanderLust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect('/listings');
    })
}