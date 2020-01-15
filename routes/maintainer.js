const express = require('express');
const router = express.Router();
const Release = require('../model/Release');
const Maintainer = require('../model/Maintainer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    Maintainer.authenticate
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
    done(null, await Maintainer.get(user))
});

router.use(passport.initialize());
router.use(passport.session());

function requireAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/maintainer/login');
    }
}

router.get('/', requireAuthenticated, async (req, res) => {
    const pendingReviews = await Release.getPending();
    const pastReviews = await req['user'].getReviewedReleases();

    const pendingReviewData = await Promise.all(pendingReviews.map(async review => {
        const cbm = await review.getCBM();
        const publisher = await cbm.getPublisher();

        return {
            id: review.id,
            version: review.version,
            cbm: cbm,
            publisher: publisher.name
        };
    }));
    const pastReviewData = await Promise.all(pastReviews.map(async review => {
        const cbm = await review.getCBM();
        const publisher = await cbm.getPublisher();

        return {
            id: review.id,
            version: review.version,
            status: review.status,
            status_at: new Date(review.status_at).toLocaleString(),
            cbm: cbm,
            publisher: publisher.name
        };
    }));

    return res.render('maintainer/index', {
        pendingReviews: pendingReviewData,
        pastReviews: pastReviewData,
        name: req['user'].name
    })
});

router.get('/login', ((req, res) => {
    req.logOut();
    return res.render('login');
}));

router.post('/login', passport.authenticate('local', {
    successRedirect: '/maintainer',
    failureRedirect: '/maintainer/login',
    failureFlash: true
}));

router.post('/review/:id', requireAuthenticated, async (req, res) => {
    const release = await Release.get(Number.parseInt(req.params.id));

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
        return res.sendStatus(500);
    }

    return res.redirect('/maintainer');
});

router.get('/review/:id', async (req, res) => {

    try {
        const release = await Release.get(Number.parseInt(req.params.id));
        const cbm = await release.getCBM();
        const publisher = await cbm.getPublisher();
        const images = await release.getImages();

        return res.render('maintainer/review', {
            ...cbm,
            ...release,
            images,
            prettyCode: release.prettyCode,
            publisher: {
                name: publisher.name,
                email: publisher.email
            }
        });
    } catch (e) {
        res.sendStatus(404);
    }
    return res.json(await Release.get(Number.parseInt(req.params.id)));
});

router.get('/logout', requireAuthenticated, (req, res) => {
    req.logOut();
    return res.redirect('/maintainer/login');
});


module.exports = router;
