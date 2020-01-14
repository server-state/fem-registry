const BaseModel = require('./BaseModel');
const Release = require('./Release');
const get = require('./Get');

module.exports = class Maintainer extends BaseModel {
    static table_name = 'maintainer';

    id;
    name;
    password;
    email;

    async getApprovedReleases() {
        return await Release.get({approved_by: this.id});
    }

    static async get(condition) {
        return await get(this, 'maintainer', condition);
    }
};
