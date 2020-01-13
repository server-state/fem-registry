const conn = require('./conn');

module.exports = function query(statement) {
    return new Promise((resolve, reject) => {
        return conn.run(statement, function(err) {
            if (err)
                reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
};
