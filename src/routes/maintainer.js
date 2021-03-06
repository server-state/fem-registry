const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const model = require('../model');

const flash=require('connect-flash');
router.use(flash());

passport.use(new LocalStrategy(
    // () => true
    model.Maintainer.authenticate
));

passport.serializeUser((user, done) => {
    done(null, {maintainerID: user.id});
});

passport.deserializeUser(async (user, done) => {
    if (!user.maintainerID)
        return done(null, null); // Logged in as a developer => not a maintainer
    return done(null, await model.Maintainer.findByPk(user.maintainerID));
});

router.use(passport.initialize());
router.use(passport.session());

function requireAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        return next();
    } else {
        return res.redirect('/maintainer/login/');
    }
}

router.get('/', requireAuthenticated,
    /**
     *
     * @param {import('express').Request & {user}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
        const pendingReviews = await model.Release.findAll({
            where: {status: model.Release.PENDING},
            attributes: ['id', 'version'],
            include: [
                {
                    model: model.FEM
                },
            ]
        });

        const pastReviews = await req['user'].getReleases({
            include: [ { model: model.FEM} ]
        });

        const pendingReviewData = await Promise.all(pendingReviews.map(async review => {
            const publisher = await review.FEM.getPublisher();

            return {
                id: review.id,
                version: review.version,
                fem: review.FEM,
                publisher: publisher.name
            };
        }));
        const pastReviewData = await Promise.all(pastReviews.map(async review => {
            const publisher = await review.FEM.getPublisher();

            return {
                id: review.id,
                version: review.version,
                status: review.status,
                status_at: new Date(review.status_at).toLocaleString(),
                fem: review.FEM,
                publisher: publisher.name
            };
        }));

        return res.render('maintainer/index', {
            pendingReviews: pendingReviewData,
            pastReviews: pastReviewData,
            name: req['user'].name
        })
    });

router.get('/login', (req, res) => {
    req.logOut();
    return res.render('login', {error: req.flash('error'), csrfToken: req.csrfToken()});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/maintainer/',
    failureRedirect: '/maintainer/login/',
    failureFlash: 'Invalid credentials. Please try again...'
}));

router.post('/review/:id', requireAuthenticated,
    /**
     *
     * @param {import('express').Request & {user}}req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
        const release = await model.Release.findByPk(req.params.id);

        try {
            if (req.body.result === 'approve') {
                await release.approve(req['user'].id);
                // TODO: Send mail to publisher
            } else {
                await release.reject(req['user'].id);
                // TODO: Send mail to publisher
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }

        res.redirect('/maintainer/');
    });

router.get('/review/:id', requireAuthenticated, async (req, res) => {
    try {
        const release = await model.Release.findByPk(req.params.id);
        const fem = await release.getFEM();
        const publisher = await fem.getPublisher();
        const images = await release.imageUrls;

        return res.render('maintainer/review', {
            fem,
            release,
            images,
            prettyCode: release.prettyCode,
            publisher: {
                name: publisher.name,
                email: publisher.email
            },
            csrfToken: req.csrfToken()
        });
    } catch (e) {
        res.sendStatus(404);
    }
    return res.json(await model.Release.get(req.params.id));
});

router.get('/logout', requireAuthenticated,
    /**
     *
     * @param {import('express').Request} req
     * @param res
     */
    (req, res) => {
        req.logOut();
        return res.redirect('/maintainer/login/');
    });


module.exports = router;
