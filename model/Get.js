const query = require('../db/query');
const exec = require('../db/exec');
const BaseModel = require('./BaseModel');

/**
 * Fetch the row with the passed id
 * @param {BaseModel.constructor} type
 * @param {string} tableName
 * @param {Object<string,string|number>|number} condition id of the row
 * @returns {Promise<this>} row as current type
 */
module.exports = async function get(type, tableName, condition) {
    if (typeof condition === 'number')
        condition = {id: condition};

    const whereString = Object.keys(condition).map(conditionName => {
        if (typeof condition[conditionName] === "string" && condition[conditionName].toLowerCase() === 'not null')
            return `${conditionName} IS NOT NULL`;
        else if (condition[conditionName] === null)
            return `${conditionName} IS NULL`;

        return `${conditionName}="${condition[conditionName]}"`
    }).join(' AND ');
    const rows = (await query(`Select * FROM ${tableName} WHERE ${whereString}`));

    if (condition.id) {
        if (rows.length !== 1)
            throw new Error('Not found');

        const instance = new type;

        for (let col in rows[0]) {
            if (rows[0].hasOwnProperty(col)) {
                instance[col] = rows[0][col];
            }
        }
        return instance;
    } else {
        return rows.map(row => {
            const instance = new type;
            for (let col in row) {
                if (row.hasOwnProperty(col)) {
                    instance[col] = row[col];
                }
            }

            return instance;
        });
    }
};
