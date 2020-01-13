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

    /**
     * Fetch the row with the passed id
     * @param {Object<string,string|number>|number} condition id of the row
     * @returns {Promise<this>} row as current type
     */
    static async get(condition) {
        if (typeof condition === 'number')
            condition = { id: condition };

        const whereString = Object.keys(condition).map(conditionName => {
            if (typeof condition[conditionName] === "string" && condition[conditionName].toLowerCase() === 'not null')
                return `${conditionName} IS NOT NULL`;

            return `${conditionName}="${condition[conditionName]}"`
        }).join(' AND ');
        const rows = (await query(`Select * FROM ${this.table_name} WHERE ${whereString}`));

        if (condition.id) {
            if (rows.length !== 1)
                throw new Error('Not found');

            const instance = new this;

            for (let col in rows[0]) {
                if (rows[0].hasOwnProperty(col) && this.hasOwnProperty(col)) {
                    instance[col] = rows[0][col];
                }
            }
            return instance;
        } else {
            return rows.map(row => {
                const instance = new this;
                for (let col in row) {
                    if (row.hasOwnProperty(col) && this.hasOwnProperty(col)) {
                        instance[col] = row[col];
                    }
                }

                return instance;
            });
        }
    }
};
