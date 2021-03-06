const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();
const model = require('../../../../model');
const fileUploadMiddleware = require('express-fileupload');
const limiter = require('../../../../lib/rateLimiter')

router.get('/', (req, res) => {
    return res.render('dev/fem/release/new', {
        fem: req['fem'],
        error: null,
        csrfToken: req.csrfToken()
    });
});

router.use(fileUploadMiddleware({
    useTempFiles: false,
    limits: {fileSize: 1024 * 1024 * 2}
}));

router.post('/', limiter,
    /**
     *
     * @param {express.Request & {fem, files}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
        try {
            // const release = await Release.createRelease(req.fem, req.files.code, req.files.images, req.body.release_notes);

            const femId = req.fem.id;
            let screenshots = req.files.images;

            if (screenshots.data) {
                screenshots = [screenshots].filter(v => v);
            }

            const imagesAreValid = screenshots.reduce((prev, curr) => prev && curr.mimetype.startsWith('image/'), true);
            if (!imagesAreValid || req.files.logo.mimtype !== 'image/png') {
                throw new Error('Not all image files are valid.')
            }


            const parsedManifest = JSON.parse(req.files.code.data.toString());

            if (parsedManifest.id !== femId)
                throw new Error('Manifest ID does not match the FEM ID.')

            const release = await model.Release.create({
                status: 0,

                FEMId: femId,

                name: parsedManifest.name,
                version: parsedManifest.version,
                code: parsedManifest.code,
                description: parsedManifest.description,
                release_notes: req.body.release_notes,
                support_url: parsedManifest.support_url,
                website: parsedManifest.website,
                repo_url: parsedManifest.repo_url,
            });

            // TODO: Copy images to correct folder
            const releaseFolder = path.join(__dirname, '../../../../../image-store', femId, release.id.toString());
            const screenshotFolder = path.join(releaseFolder, 'screenshots');

            if (fs.existsSync(releaseFolder))
                fs.rmdirSync(releaseFolder, {recursive: true})
            fs.mkdirSync(screenshotFolder, {recursive: true});

            fs.writeFileSync(path.join(releaseFolder, 'logo.png'), req.files.logo.data)

            for (let screenshot of screenshots) {
                fs.writeFileSync(path.join(screenshotFolder, screenshot.name), screenshot.data);
            }


            res.redirect(`../${release.id}/`);
        } catch (e) {
            res.render('dev/fem/release/new', {error: e.message, fem: req.fem, csrfToken: req.csrfToken()});
        }
    });

module.exports = router;
