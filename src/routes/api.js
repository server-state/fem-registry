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
 * Returns fem release data, optionally filtered by the search query with the `q` GET parameter, TODO: ordered by popularity
 */
router.get('/fem', async (req, res) => {
    try {
        const query = req.query['q'] || ''; // /api/plugins?q=My+Plugin
        const page = req.query['p'] || 1; // /api/plugins?q=My+Plugin

        const ids = await model.Release.findAll({
            attributes: [[model.sequelize.constructor.fn('max', model.sequelize.constructor.col('id')), 'id']],
            limit: 16,
            offset: 16 * (page - 1),
            group: 'FEMId',
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
                model: model.FEM, attributes: ['id'], include: [
                    {
                        model: model.Publisher,
                        attributes: ['name']
                    }
                ]
            }]
        }));

        return res.json(raw.map(release => ({
            ...JSON.parse(JSON.stringify(release)),
            FEM: undefined,
            status: undefined,
            code: undefined,
            createdAt: undefined,
            id: release.FEMId,
            FEMId: undefined,
            status_by: undefined,
            status_at: undefined,
            logo: release.logoUrl,
            images: release.imageUrls,
            publisher: release.FEM.Publisher.name
        })));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.get('/fem/:id', async (req, res) => {
    try {
        const fem = await model.FEM.findByPk(req.params.id);
        const release = await fem.getLatestApprovedRelease();
        return res.json({
            ...JSON.parse(JSON.stringify(release)),
            status: undefined,
            code: undefined,
            createdAt: undefined,
            femId: release.FEMId,
            FEMId: undefined,
            status_by: undefined,
            status_at: undefined,
            logo: release.logoUrl,
            images: release.imageUrls,
            publisher: (await fem.getPublisher()).name
        });
    } catch (e) {
        console.warn(e);
        return res.sendStatus(404);
    }
});

router.get('/fem/:id/download', async (req, res) => {
    try {
        const fem = await model.FEM.findByPk(req.params.id);
        const release = await fem.getLatestApprovedRelease();
        return res.json({
            ...JSON.parse(JSON.stringify(release)),
            status: undefined,
            createdAt: undefined,
            femId: release.FEMId,
            FEMId: undefined,
            status_by: undefined,
            status_at: undefined,
            logo: release.logoUrl,
            images: release.imageUrls,
            publisher: (await fem.getPublisher()).name
        });
    } catch (e) {
        console.warn(e);
        return res.sendStatus(404);
    }
});

module.exports = router;
