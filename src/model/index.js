'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env['NODE_ENV'] || 'development';

/**
 * @type {{CBM, Maintainer, PendingEmailConfirmations, Publisher, Release}}
 */
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

db.sequelize.sync().then(async () => {
    if (env === 'development') {
        const maintainer = new db.Maintainer();

        maintainer.name = 'Pablo Klaschka';
        maintainer.email = 'contact@pabloklaschka.de';
        await maintainer.setPassword('12345');

        const publisher = new db.Publisher();
        publisher.name = 'Test';
        publisher.email = 'klaschka@fliegwerk.com';
        publisher.password = maintainer.password;
        await publisher.save();

        const cbm = new db.CBM({id: '105d0ba4-55d0-4724-871b-c39483923769', name: 'Test CBM', PublisherId: publisher.id});
        cbm.name = 'Table CBM';
        await cbm.save();

        const release = await db.Release.create({
            name: 'Table CBM',
            version: 'v1.0.0',
            code: 'export default () => true',
            support_url: 'httpjfwoejf'
        });
        await release.setCBM(cbm);
    }
});

module.exports = db;
