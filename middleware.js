module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash('error', 'Please login!');
        return res.redirect('/login');
    }
    next();
}
