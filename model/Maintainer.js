const BaseModel = require('./BaseModel');
const get = require('./Get');
const bcrypt = require('bcryptjs');

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

    async setPassword(password) {
        this.password = await bcrypt.hash(password, 8);
    }

    static async get(condition) {
        return await get(this, 'maintainer', condition);
    }

    static async authenticate(email, password, done) {
        try {
            const maintainer = (await Maintainer.get({email: email}))[0];

            const isMatch = await bcrypt.compare(password, maintainer.password);
            if (isMatch) {
                return done(null, maintainer);
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(null, false);
        }
    }
}
;
