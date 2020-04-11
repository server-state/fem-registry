const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

const requireCreation = !fs.existsSync(path.join(__dirname, 'db.sqlite'));

const conn = new Sequelize('sqlite::memory:', {
    logging: false
});


// if (requireCreation)
    // conn.exec(fs.readFileSync(path.join(__dirname, 'create.sql')).toString());

module.exports = conn;
