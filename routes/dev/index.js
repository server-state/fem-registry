const express = require('express');
const router = express.Router();
const cbmRouter = require('./cbm/cbm');
const profileRouter = require('./profile/profile');
const Publisher = require('../../model/Publisher');
const passport = new (require('passport').Passport)();
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    Publisher.authenticate
));

passport.serializeUser((user, done) => {
    done(null, {publisherId: user.id});
});

passport.deserializeUser(async (user, done) => {
    if (!user.publisherId)
        return done(null, null); // logged in as a maintainer => not a publisher
    return done(null, await Publisher.get(user.publisherId))
});

router.use(passport.initialize());
router.use(passport.session());

function requireAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/dev/login/');
    }
}

router.get('/login/', ((req, res) => {
    req.logOut();
    return res.render('login', {forgotPassword: '../forgot-password/'});
}));

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dev/',
    failureRedirect: '/dev/login/',
    failureFlash: true
}));

router.get('/logout', requireAuthenticated,
    /**
     * @param {import('express').Request} req
     * @param res
     */
    (req, res) => {
        req.logOut();
        return res.redirect('/dev/login/');
    });

/* GET users listing. */
router.get('/', requireAuthenticated,
    /**
     * @param {express.Request & {user}} req
     * @param res
     * @returns {Promise<void>}
     */
    async function (req, res) {
        const cbms = await req['user'].getCBMs();
        res.render('dev/index', {
            name: req['user'].name,
            cbms
        });
    });

router.use('/forgot-password', require('./password-reset'));

router.use('/cbm', requireAuthenticated, cbmRouter);
router.use('/profile', requireAuthenticated, profileRouter);

module.exports = router;
