const express = require('express');
const router = express.Router();
const Release = require('../model/Release');
const Maintainer = require('../model/Maintainer');

router.get('/', async (req, res) => {
    const pendingReviews = await Release.getPending();
    const pastReviews = await (await Maintainer.get(1)).getReviewedReleases();
    console.log(pastReviews);

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
        name: 'Pablo'
    })
});

router.post('/review/:id', async (req, res) => {
    const release = await Release.get(Number.parseInt(req.params.id));

    try {
        if (req.body.result === 'approve') {
            await release.approve(1);
            // TODO: Send mail to publisher
        } else {
            await release.reject(1);
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

        if (req.post) {
            // Handle form input
            console.log(req.post);
            return res.redirect('/maintainer');
        } else {
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
        }
    } catch (e) {
        res.sendStatus(404);
    }
    return res.json(await Release.get(Number.parseInt(req.params.id)));
});

module.exports = router;
