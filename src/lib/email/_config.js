const Email = require('email-templates');
const path = require('path');

const transport = process.env.NODE_ENV === 'production'
    ? require('nodemailer').createTransport(require('../../../config/config.json').smtp)
    : {jsonTransport: true};
/**
 * @type {*}
 * An email config using the server's configuration for sending emails.
 *
 * @example```js
 await email.send({
    template: 'some-template',
    message: {
        to: recipient
    },
    locals: {
        someVariableExposedInTemplate
    }
})
 ```
 */
module.exports = new Email({
    message: {
        from: process.env.NODE_ENV === 'production' ? require('../../../config/config.json').smtp.auth.user
            : 'development@cbm-registry'
    },
    transport,
    views: {
        root: path.resolve(__dirname, '../../views/email')
    }
});
