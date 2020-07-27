const express = require('express');
const router = express.Router();
const femRouter = require('./fem/fem');
const profileRouter = require('./profile/profile');
const model = require('../../model');
const passport = new (require('passport').Passport)();
const LocalStrategy = require('passport-local').Strategy;

const flash=require('connect-flash');
router.use(flash());

passport.use(new LocalStrategy(
    model.Publisher.authenticate
));

passport.serializeUser((user, done) => {
    done(null, {publisherId: user.id});
});

passport.deserializeUser(async (user, done) => {
    if (!user.publisherId)
        return done(null, null); // logged in as a maintainer => not a publisher
    return done(null, await model.Publisher.findByPk(user.publisherId))
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
    return res.render('login', {forgotPassword: '../forgot-password/', error: req.flash('error'), signUp: true, csrfToken: req.csrfToken()});
}));

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dev/',
    failureRedirect: '/dev/login/',
    failureFlash: 'Invalid credentials. Please try again...'
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
        const fems = await req['user'].getFEMs();
        res.render('dev/index', {
            name: req['user'].name,
            fems
        });
    });

router.use('/forgot-password', require('./password-reset'));
router.use('/sign-up', require('./sign-up'));

router.use('/fem', requireAuthenticated, femRouter);
router.use('/profile', requireAuthenticated, profileRouter);

module.exports = router;
