const Publisher = require('./Publisher');
const BaseModel = require('./BasicModel');

module.exports = class CBM extends BaseModel {
    id;
    name;
    publisher_id;
    repo_url;
    support_url;
    website;

    async getPublisher() {
        return await Publisher.get(this.publisher_id);
    }
};
