const BaseModel = require('./BaseModel');
const Publisher = require('./Publisher');
const Release = require('./Release');
const get = require('./Get');
const query = require('../db/query');
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

    static async search(q, page = 1) {
        const res = await query(`
        SELECT cbm_id, MAX(release.id) as release_id, "release".name
        FROM "release",
            "cbm"
        where cbm.id = cbm_id
        AND status = 1
        AND "release".name LIKE ?
        GROUP BY cbm.id
        ORDER BY release_id DESC
        LIMIT ?,20;
        `, [`%${q}%`, (page - 1) * 20]);
        console.log(res);
        return res;
    }
};
