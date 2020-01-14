const express = require('express');
const router = express.Router();
const Release = require('../model/Release');

router.get('/', async (req, res) => {
    const pendingReviews = await Release.getPending();

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

    return res.render('maintainer/index', {
        pendingReviews: pendingReviewData,
        pastReviews: [],
        name: 'Pablo'
    })
});

router.post('/review/:id', async (req, res) => {
    return res.json(req.body);
});

router.get('/review/:id', async (req, res) => {

    try {
        const release = await Release.get(Number.parseInt(req.params.id));
        const cbm = await release.getCBM();
        const publisher = await cbm.getPublisher();
        if (req.post) {
            // Handle form input
            console.log(req.post);
            return res.redirect('/maintainer');
        } else {
            return res.render('maintainer/review', {
                ...cbm,
                ...release,
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
