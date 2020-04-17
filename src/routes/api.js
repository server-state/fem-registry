const express = require('express');
const router = express.Router();
const model = require('../model');
const {Op} = require('sequelize');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', function (req, res) {
    return res.json({status: 'ok'})
});

/**
 * Returns cbm release data, optionally filtered by the search query with the `q` GET parameter, TODO: ordered by popularity
 */
router.get('/cbm', async (req, res) => {
    try {
        const query = req.query['q'] || ''; // /api/plugins?q=My+Plugin
        const page = req.query['p'] || 1; // /api/plugins?q=My+Plugin

        const ids = await model.Release.findAll({
            attributes: [[model.sequelize.constructor.fn('max', model.sequelize.constructor.col('id')), 'id']],
            limit: 16,
            offset: 16 * (page - 1),
            group: 'CBMId',
            where: {
                status: 1,
                [Op.or]: [
                    {name: {[Op.substring]: query}},
                    {description: {[Op.substring]: query}}
                ]
            },
            raw: true
        });

        const raw = (await model.Release.findAll({
            where: {id: ids.map(obj => obj.id)},
            include: [{
                model: model.CBM, attributes: ['id'], include: [
                    {
                        model: model.Publisher,
                        attributes: ['name']
                    }
                ]
            }]
        }));

        return res.json(raw.map(release => ({
            ...JSON.parse(JSON.stringify(release)),
            CBM: undefined,
            status: undefined,
            code: undefined,
            createdAt: undefined,
            id: release.CBMId,
            CBMId: undefined,
            status_by: undefined,
            status_at: undefined,
            logo: release.logoUrl,
            images: release.imageUrls,
            publisher: release.CBM.Publisher.name
        })));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.get('/cbm/:id', async (req, res) => {
    try {
        const cbm = await model.CBM.findByPk(req.params.id);
        const release = await cbm.getLatestApprovedRelease();
        return res.json({
            ...JSON.parse(JSON.stringify(release)),
            status: undefined,
            code: undefined,
            createdAt: undefined,
            cbmId: release.CBMId,
            CBMId: undefined,
            status_by: undefined,
            status_at: undefined,
            logo: release.logoUrl,
            images: release.imageUrls,
            publisher: (await cbm.getPublisher()).name
        });
    } catch (e) {
        console.warn(e);
        return res.sendStatus(404);
    }
});

router.get('/cbm/:id/download', async (req, res) => {
    try {
        const cbm = await model.CBM.findByPk(req.params.id);
        const release = await cbm.getLatestApprovedRelease();
        return res.json({
            ...JSON.parse(JSON.stringify(release)),
            status: undefined,
            createdAt: undefined,
            cbmId: release.CBMId,
            CBMId: undefined,
            status_by: undefined,
            status_at: undefined,
            logo: release.logoUrl,
            images: release.imageUrls,
            publisher: (await cbm.getPublisher()).name
        });
    } catch (e) {
        console.warn(e);
        return res.sendStatus(404);
    }
});

module.exports = router;
