const express = require('express');
const router = express.Router();
const cbmRouter = require('./cbm');
const Publisher = require('../../model/Publisher');
const passport = new (require('passport').Passport)();
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    Publisher.authenticate
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
    done(null, await Publisher.get(user))
});

router.use(passport.initialize());
router.use(passport.session());

function requireAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/dev/login');
    }
}

router.get('/login', ((req, res) => {
    req.logOut();
    return res.render('login');
}));

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dev',
    failureRedirect: '/dev/login',
    failureFlash: true
}));

router.get('/logout', requireAuthenticated, (req, res) => {
    req.logOut();
    return res.redirect('/dev/login');
});

/* GET users listing. */
router.get('/', requireAuthenticated, async function (req, res) {
    const cbms = await req['user'].getCBMs();
    res.render('dev/index', {
        name: req['user'].name,
        cbms
    });
});

router.use('/cbm', requireAuthenticated, cbmRouter);

module.exports = router;
