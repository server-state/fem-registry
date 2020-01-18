const BaseModel = require('./BaseModel');
const get = require('./Get');
const bcrypt = require('bcryptjs');

module.exports = class Publisher extends BaseModel {
    static table_name = 'publisher';

    /**
     * @type {number}
     */
    id;
    name;
    password;
    email;

    async getCBMs() {
        const CBM = require('./CBM');
        return await CBM.get({publisher_id: this.id});
    }

    async setPassword(password) {
        this.password = await bcrypt.hash(password, 8);
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    static async get(condition) {
        return await get(this, 'publisher', condition);
    }

    static async authenticate(email, password, done) {
        try {
            const maintainer = (await Publisher.get({email: email}))[0];

            const isMatch = bcrypt.compare(password, maintainer.password);
            if (isMatch) {
                return done(null, maintainer);
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(null, false);
        }
    }
};
