const sqlite = require('sqlite3');
const path = require('path');
const fs = require('fs');

const requireCreation = !fs.existsSync(path.join(__dirname, 'db.sqlite'));

const conn = new sqlite.Database(path.join(__dirname, 'db.sqlite'));

if (requireCreation)
    conn.exec(fs.readFileSync(path.join(__dirname, 'create.sql')).toString());

module.exports = conn;
