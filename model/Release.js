const BaseModel = require('./BaseModel');
const get = require('./Get');
const beautify = require('prettier');

const {PENDING, APPROVED, REJECTED} = require('./Status');

module.exports = class Release extends BaseModel {
    static table_name = 'release';

    id;
    cbm_id;
    version;
    code;
    name;
    description = '';
    release_notes = '';
    repo_url;
    support_url;
    website;
    /**
     * @type {PENDING | APPROVED | REJECTED}
     */
    status = PENDING;
    status_by;
    status_at;

    async getCBM() {
        const CBM = require('./CBM');
        return await CBM.get(this.cbm_id);
    }

    async getApprover() {
        const Maintainer = require('./Maintainer');
        if (this.status !== APPROVED) {
            return null;
        }

        return await Maintainer.get(this.status_by);
    }

    isApproved() {
        return this.status === APPROVED;
    }

    async getImages() {
        const Image = require('./Image');
        return await Image.get({release_id: this.id});
    }

    async approve(maintainerID) {
        this.status_by = maintainerID;
        this.status_at = Date.now();
        this.status = APPROVED;

        await this.save();
    }

    async reject(maintainerID) {
        this.status_by = maintainerID;
        this.status_at = Date.now();
        this.status = REJECTED;

        await this.save();
    }

    get prettyCode() {
        return beautify.format(this.code, {
            singleQuote: true,
        });
    }

    static async get(condition) {
        return await get(this, 'release', condition);
    }

    static async getPending() {
        return await this.get({status: PENDING});
    }

    static async createRelease(cbm, code, images, releaseNotes) {
        if (images.data)
            images = [images].filter(v => v);

        const parsedCode = JSON.parse(code.data.toString());

        if (
            !parsedCode.id
            || !parsedCode.code
            || !parsedCode.version
            || !parsedCode.support_url
        ) {
            throw new Error('CBM metadata is missing a required field');
        }

        if (parsedCode.id !== cbm.id.toString())
            throw new Error('Manifest ID does not match the CBM ID');

        const imagesAreValid = images.reduce((prev, curr) => prev && curr.mimetype.startsWith('image/'), true);

        if (!imagesAreValid)
            throw new Error('Not all submitted image files are actually images');

        // If we get to this point, we know everything about this is valid ;-)
        const r = new Release();
        r.cbm_id = cbm.id;
        r.code = parsedCode.code;
        r.support_url = parsedCode.support_url;
        r.name = parsedCode.name;
        r.version = parsedCode.version;
        r.description = parsedCode.description;
        r.release_notes = releaseNotes;
        r.website = parsedCode.website;
        r.repo_url = parsedCode.repo_url;
        r.status = PENDING;

        await r.save();

        // Uploading images:
        const Image = require('./Image');

        for (let image of images) {
            await Image.create(r, image);
        }

        return r;
    }
};
