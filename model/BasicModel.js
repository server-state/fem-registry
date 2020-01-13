const query = require('../db/query');

module.exports = class BaseModel {
    /**
     * Fetch the row with the passed id
     * @param {Object<string,string|number>|number} condition id of the row
     * @returns {Promise<this>} row as current type
     */
    static async get(condition) {
        const cbm = new this;
        if (typeof condition === 'number')
            condition = { id: condition };

        const whereString = Object.keys(condition).map(conditionName => `${conditionName}="${condition[conditionName]}"`).join(' AND ');
        const rows = (await query(`Select * FROM cbm WHERE ${whereString}`));

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
