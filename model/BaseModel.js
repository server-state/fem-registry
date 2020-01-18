const exec = require('../db/exec');
const escape = require('escape-quotes');

module.exports = class BaseModel {
    id;

    static table_name;

    async save() {
        if (this.id) {
            // Update
            const fields = Object.keys(this).filter(field => field !== 'id');

            const updateString = fields.map(
                field => `${field} = ?`
            ).join(',');

            // noinspection SqlResolve
            return await exec(`UPDATE ${escape(this.constructor.table_name)} SET ${updateString} WHERE id=?`, [...fields.map(key => this[key]), this.id]);
        } else {
            // Create
            const fields = Object.keys(this).filter(field => this[field]);

            const values = fields.map(field => this[field]);
            const statement = `INSERT INTO '${escape(this.constructor.table_name)}' (${fields.join(',')}) VALUES (${values.map(()=>'?').join(',')})`;

            this.id = await exec(statement, ...values);
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

