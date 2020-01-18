const BaseModel = require('./BaseModel');
const get = require('./Get');

module.exports = class Image extends BaseModel {
    static table_name = 'image';

    id;
    release_id;
    alt;
    data;
    mime_type;

    async getRelease() {
        const Release = require('./Release');
        return await Release.get(this.release_id);
    }

    static async get(condition) {
        return await get(this, 'image', condition);
    }

    static async create(release, image) {
        const i = new Image();
        i.mime_type = image.mimetype;
        i.data = image.data;
        i.alt = 'TODO: Alt text';
        i.release_id = release.id;
        await i.save();

        return i;
    }
};
