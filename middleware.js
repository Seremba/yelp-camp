module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl)
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login!');
        return res.redirect('/login');
    }
    next();
}
