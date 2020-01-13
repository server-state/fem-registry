const BaseModel = require('./BasicModel');

module.exports = class Maintainer extends BaseModel {
    id;
    name;
    password;
    email;
};
