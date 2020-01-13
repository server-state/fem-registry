const BaseModel = require('./BasicModel');
const CBM = require('./CBM');

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
        return await CBM.get({publisher_id: this.id});
    }
};
