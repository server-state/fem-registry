const BaseModel = require('./BaseModel');
const get = require('./Get');

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

    static async get(condition) {
        return await get(this, 'publisher', condition);
    }
};
