const BaseModel = require('./BasicModel');
const Release = require('./Release');

module.exports = class Maintainer extends BaseModel {
    static table_name = 'maintainer';

    id;
    name;
    password;
    email;

    async getApprovedReleases() {
        return await Release.get({approved_by: this.id});
    }
};
