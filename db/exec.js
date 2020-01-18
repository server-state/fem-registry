const conn = require('./conn');

module.exports = function exec(statement, ...args) {
    return new Promise((resolve, reject) => {
        return conn.run(statement, ...args, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};
