const { Sequelize } = require('sequelize');

const config = process.env.NODE_ENV === 'production' ? require('../config/config.json').db : {
    dialect: 'sqlite',
    storage: ':memory:'
};

console.log('Using', config);

const conn = new Sequelize(config);

module.exports = conn;
