const url = new require('url');

const isProd = process.env.NODE_ENV === 'production';
let baseURL = null;

if (isProd) {
    const config = require('../../config/config.json').constants.baseURL;

    if (!config)
        throw new Error('constants.baseURL was not defined in config.json, but is required.')
    else
        baseURL = config;
}

/**
 *
 * @param {import('express').Request} req
 */
module.exports = function getBaseURL(req) {
    const {protocol} = req;

    return process.env.NODE_ENV === 'production'
        ? baseURL
        : `${protocol}://${req.get('host')}`;
}
