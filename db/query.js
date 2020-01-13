const conn = require('./conn');

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
