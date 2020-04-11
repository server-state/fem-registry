'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env['NODE_ENV'] || 'development';
const db = {};

const sequelize = require('../../db/conn');

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

db.sequelize.sync().then(() => {
    const maintainer = new db.Maintainer();

    maintainer.name = 'Pablo Klaschka';
    maintainer.email = 'contact@pabloklaschka.de';
    maintainer.setPassword('12345').then(res => {
        db.Maintainer.findAll().then(res => console.log(res));
    });
});

module.exports = db;
