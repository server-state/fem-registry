const Maintainer = require('./Maintainer');
const CBM = require('./CBM');
const BaseModel = require('./BasicModel');
const Image = require('./Image');

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
        return await CBM.get(this.cbm_id);
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
};
