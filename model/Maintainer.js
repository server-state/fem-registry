const BaseModel = require('./BaseModel');
const get = require('./Get');

module.exports = class Maintainer extends BaseModel {
    static table_name = 'maintainer';

    id;
    name;
    password;
    email;

    async getReviewedReleases() {
        const Release = require('./Release');
        return await Release.get({status_by: this.id});
    }

    static async get(condition) {
        return await get(this, 'maintainer', condition);
    }
};
