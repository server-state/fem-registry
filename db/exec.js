const conn = require('./conn');

/**
 * Executes an SQL statement in the database.
 * @param {string} statement The statement itself. Can contain `?` as
 * placeholders for values specified in `args`. They, then, automatically get escaped
 * @param args Arguments for the prepared statement. Replaces `?` in the statement
 * @returns {Promise<number>} The inserted ID, if defined. Only for `INSERT` statements.
 *
 * @example ```js
const insertedId = await query(
  'INSERT INTO "table" (name) VALUES (?)', 
  myName
);
 * ```
 */
module.exports = function exec(statement, ...args) {
    return new Promise((resolve, reject) => {
        return conn.run(statement, ...args, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};
