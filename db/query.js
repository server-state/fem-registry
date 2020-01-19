const conn = require('./conn');

/**
 * Queries the database using the specified `statement`.
 * @param {string} statement The statement itself. Can contain `?` as
 * placeholders for values specified in `args`. They, then, automatically get escaped
 * @param args Arguments for the prepared statement. Replaces `?` in the statement
 * @returns {Promise<Object<string, *>[]>} The rows as JS objects in key-value-pair form where the column name is the key.
 * 
 * @example ```js
const results = await query(
  'SELECT * FROM "table" WHERE "table".id=?', 
  myID
);
 * ```
 */
module.exports = function query(statement, ...args) {
    return new Promise((resolve, reject) => {
        const stmt = conn.prepare(statement);
        return stmt.all(...args, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);

            // stmt.finalize();
        });
    });
};
