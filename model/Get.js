const query = require('../db/query');
const escape = require('escape-quotes');

/**
 * Fetch the row with the passed id
 * @param {new () => import('./BaseModel')} type
 * @param {string} tableName
 * @param {Object<string,string|number>|number} condition id of the row
 * @returns {Promise<import('./BaseModel') | import('./BaseModel')[]>} row as current type
 */
module.exports = async function get(type, tableName, condition) {
    if (typeof condition === 'number')
        condition = {id: condition};

    const whereString = Object.keys(condition).map(conditionName => {
        if (typeof condition[conditionName] === "string" && condition[conditionName].toLowerCase() === 'not null')
            return `${conditionName} IS NOT NULL`;
        else if (condition[conditionName] === null)
            return `${conditionName} IS NULL`;

        return `${conditionName}='${escape(condition[conditionName])}'`
    }).join(' AND ');
    const rows = (await query(`Select * FROM '${escape(tableName)}' WHERE ${whereString}`));

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
