const conn = require('./conn');

module.exports = function query(statement, ...args) {
    return new Promise((resolve, reject) => {
        const stmt = conn.prepare(statement);
        return stmt.exec(...args, function(err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
};
