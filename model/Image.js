const BaseModel = require('./BasicModel');
const Release = require('./Release');

module.exports = class Image extends BaseModel {
    static table_name = 'image';

    id;
    release_id;
    alt;
    data;

    async getRelease() {
        return await Release.get(this.release_id);
    }
};
