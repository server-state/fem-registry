const BaseModel = require('./BaseModel');
const Maintainer = require('./Maintainer');
const Cbm = require('./Cbm');
const Image = require('./Image');
const get = require('./Get');

module.exports = class Release extends BaseModel {
    static table_name = 'release';

    id;
    cbm_id;
    version;
    code;
    description;
    release_notes;
    approved_by;
    approved_at;

    async getCBM() {
        // return await get(Cbm, 'cbm', this.cbm_id);
        return await Cbm.get(this.cbm_id);
    }

    async getApprover() {
        if (!this.approved_by) {
            return null;
        }

        return await Maintainer.get(this.approved_by);
    }

    async getImages() {
        return await Image.get({release_id: this.id});
    }

    static async get(condition) {
        return await get(this, 'release', condition);
    }
};
