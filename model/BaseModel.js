const query = require('../db/query');
const exec = require('../db/exec');

module.exports = class BaseModel {
    id;

    static table_name;

    async save() {
        if (this.id) {
            // Update
            const fields = Object.keys(this);

            const updateString = fields.map(
                field => `${field} = "${this[field]}"`
            ).join(',');
            // noinspection SqlResolve
            return await exec(`UPDATE ${this.constructor.table_name} SET ${updateString} WHERE id=${this.id};`);
        } else {
            // Create
            const fields = Object.keys(this).filter(field => this[field]);

            const valuesString = fields.map(field => `"${this[field]}"`).join(',');
            const statement = `INSERT INTO ${this.constructor.table_name} (${fields.join(',')}) VALUES (${valuesString})`;

            this.id = await exec(statement);
            console.log(this.id);
            return this.id;
        }
    }

    /**
     * Delete this entry from the database table
     * @returns {Promise<void>}
     */
    async delete() {
        // noinspection SqlResolve
        return await exec(`DELETE FROM ${this.constructor.table_name} WHERE id=${this.id}`);
    }
};

