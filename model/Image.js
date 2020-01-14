const BaseModel = require('./BaseModel');
const get = require('./Get');

module.exports = class Image extends BaseModel {
    static table_name = 'image';

    id;
    release_id;
    alt;
    data;

    async getRelease() {
        const Release = require('./Release');
        return await Release.get(this.release_id);
    }

    static async get(condition) {
        return await get(this, 'image', condition);
    }
};
