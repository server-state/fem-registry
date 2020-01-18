const BaseModel = require('./BaseModel');
const Publisher = require('./Publisher');
const Release = require('./Release');
const get = require('./Get');
const {APPROVED} = require("./Status");

module.exports = class CBM extends BaseModel {
    static table_name = 'cbm';

    id;
    name = 'My CBM';
    publisher_id;

    async getPublisher() {
        return await Publisher.get(this.publisher_id);
    }

    async getReleases(mustBeApproved) {
        return await Release.get(mustBeApproved ? {cbm_id: this.id, status: APPROVED} : {cbm_id: this.id});
    }

    async getLatestApprovedRelease() {
        const releases = await this.getReleases(true);
        return releases.length > 0 ? releases[releases.length - 1] : null;
    }

    static async get(condition) {
        return await get(this, 'cbm', condition);
    }
};
