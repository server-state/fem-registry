const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const Release = require('../model/Release');
    const pendingReviews = await Release.get({approved_at: null});

    return res.render('maintainer/index', {
        pendingReviews: await pendingReviews.map(async review => {
            const cbm = await review.getCBM();
            const publisher = await cbm.getPublisher();

            return {
                id: review.id,
                version: review.version,
                cbm: cbm,
                publisher: publisher.name
            };
        }),
        pastReviews: [],
        name: 'Pablo'
    })
});

module.exports = router;
