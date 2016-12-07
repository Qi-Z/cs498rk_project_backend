module.exports = function(router, passport) {

    router.post('/signup', passport.authenticate('local-signup', {session: true}), function(req, res) {
        req.login(req.user, function(err) {
            if (err) {
                console.log("fail to login after registration");
            } else {
                res.status(200).json({ user: req.user });
            }
        });
        res.status(200).json({ user: req.user });
    });

    router.post('/login', passport.authenticate('local-login', {session: true}), function(req, res) {
        res.status(200).json({ user: req.user });
    });

    router.get('/profile', isLoggedIn, function(req, res) {
        res.status(200).json({ user: req.user, message: "Welcome!" });
    });

    router.get('/logout', function(req, res) {
        req.logOut();
        res.status(200).json({ message: "logged out "});
    });

    return router;
}

function isLoggedIn(req, res, next) {
    console.log(req); // See what's in req
    if ( req.isAuthenticated() ) {
        return next();
    }
    console.log("unable to auth");

    return res.status(401).json({ message: "unable to auth" });
}
