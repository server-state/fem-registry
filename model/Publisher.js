const BaseModel = require('./BasicModel');
const CBM = require('./CBM');

module.exports = class Publisher extends BaseModel {
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
