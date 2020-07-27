'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env['NODE_ENV'] || 'development';

/**
 * @type {{FEM, Maintainer, PendingEmailConfirmations, Publisher, Release}}
 */
const db = {};

const sequelize = require('../db/conn');
const Sequelize = require('sequelize');

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

db.sequelize.sync().then(async () => {
    if (env !== 'production') {
        const maintainer = new db.Maintainer();

        maintainer.name = 'Pablo Klaschka';
        maintainer.email = 'contact@pabloklaschka.de';
        await maintainer.setPassword('12345');

        const publisher = new db.Publisher();
        publisher.name = 'Test';
        publisher.email = 'klaschka@fliegwerk.com';
        publisher.password = maintainer.password;
        await publisher.save();

        const fem = new db.FEM({id: '105d0ba4-55d0-4724-871b-c39483923769', name: 'Test FEM', PublisherId: publisher.id});
        fem.name = 'Table FEM';
        await fem.save();

        const release = await db.Release.create({
            name: 'Table FEM',
            version: 'v1.0.0',
            code: 'export default () => true',
            support_url: 'httpjfwoejf'
        });
        await release.setFEM(fem);

        const release2 = await db.Release.create({
            name: 'Table FEM',
            version: 'v1.0.1',
            code: 'export default () => true',
            support_url: 'httpjfwoejf',
            status: 1,
            status_by: maintainer.id
        });
        await release2.setFEM(fem);

        const release3 = await db.Release.create({
            name: 'Table FEM',
            version: 'v1.0.1',
            code: 'export default () => true',
            support_url: 'httpjfwoejf',
            status: 1,
            status_by: maintainer.id
        });
        await release3.setFEM(fem);
    }
});

module.exports = db;
