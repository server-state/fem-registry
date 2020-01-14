const BaseModel = require('./BaseModel');
const get = require('./Get');

const {PENDING, APPROVED, REJECTED} = require('./Status');

module.exports = class Release extends BaseModel {
    static table_name = 'release';

    id;
    cbm_id;
    version;
    code;
    description;
    release_notes;
    /**
     * @type {PENDING | APPROVED | REJECTED}
     */
    status;
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

    static async get(condition) {
        return await get(this, 'release', condition);
    }

    static async getPending() {
        return await this.get({status: PENDING});
    }
};
