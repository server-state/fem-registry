const exec = require('../db/exec');
const escape = require('escape-quotes');

module.exports = class BaseModel {
    id;

    static table_name;

    async save() {
        if (this.id) {
            // Update
            const fields = Object.keys(this);

            const updateString = fields.map(
                field => `'${escape(field)}' = '${escape(this[field])}'`
            ).join(',');
            // noinspection SqlResolve
            return await exec(`UPDATE ${this.constructor.table_name} SET ${updateString} WHERE id=${this.id};`);
        } else {
            // Create
            const fields = Object.keys(this).filter(field => this[field]);

            const valuesString = fields.map(field => `'${escape(this[field])}'`).join(',');
            const statement = `INSERT INTO '${escape(this.constructor.table_name)}' (${fields.join(',')}) VALUES (${valuesString})`;

            this.id = await exec(statement);
            return this.id;
        }
    }

    /**
     * Delete this entry from the database table
     * @returns {Promise<void>}
     */
    async delete() {
        // noinspection SqlResolve
        return await exec(`DELETE FROM '${escape(this.constructor.table_name)}' WHERE id='${escape(this.id)}'`);
    }
};

