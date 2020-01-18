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
};
