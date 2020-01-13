const query = require('../db/query');
const exec = require('../db/exec');

module.exports = class BaseModel {
    id;

    static table_name;

    async save() {
        if (this.id) {
            // Update
            const fields = Object.keys(this);

            return await exec(`UPDATE ? SET (?) (?) WHERE id=?`, this.constructor.table_name, fields.join(','), fields.map(field => `"${this[field]}"`).join(','), this.id);
        } else {
            // Create
            const fields = Object.keys(this);

            this.id = await exec(`INSERT INTO ? (?) VALUES (?)`, this.constructor.table_name, fields.join(','), fields.map(field => `"${this[field]}"`).join(','));
        }
    }

    async delete() {
        return await exec(`DELETE FROM ? WHERE id=?;`, this.constructor.table_name, this.id);
    }

    /**
     * Fetch the row with the passed id
     * @param {Object<string,string|number>|number} condition id of the row
     * @returns {Promise<this>} row as current type
     */
    static async get(condition) {
        const cbm = new this;
        if (typeof condition === 'number')
            condition = { id: condition };

        const whereString = Object.keys(condition).map(conditionName => {
            if (condition[conditionName].toLowerCase() === 'not null')
                return `${conditionName} NOT IS NULL`;

            return `${conditionName}="${condition[conditionName]}"`
        }).join(' AND ');
        const rows = (await query(`Select * FROM ? WHERE ${whereString}`, this.constructor.table_name));

        if (condition.id) {
            if (rows.length !== 1)
                throw new Error('Not found');

            const instance = new this;

            for (let col in rows[0]) {
                instance[col] = rows[0][col];
            }
            return instance;
        } else {
            return rows.map(row => {
                const instance = new this;
                for (let col in row) {
                    instance[col] = row[col];
                }

                return instance;
            });
        }
    }
};
