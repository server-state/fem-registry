const Publisher = require('./Publisher');
const Release = require('./Release');
const BaseModel = require('./BasicModel');

module.exports = class CBM extends BaseModel {
    static table_name = 'cbm';

    id;
    name;
    publisher_id;
    repo_url;
    support_url;
    website;

    async getPublisher() {
        return await Publisher.get(this.publisher_id);
    }

    async getReleases(mustBeApproved) {
        return await Release.get(mustBeApproved ? {cbm_id: this.id, approved_at: 'NOT NULL'} : {cbm_id: this.id});
    }

    async getLatestApprovedRelease() {
        const releases = await this.getReleases(true);
        return releases.length > 0 ? releases[releases.length - 1] : null;
    }
};
