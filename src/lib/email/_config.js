const Email = require('email-templates');
const path = require('path');

const transport = process.env.NODE_ENV === 'production'
    ? require('nodemailer').createTransport(require('../../../config/config.json').smtp)
    : { jsonTransport: true };
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
        from: 'cockpit@fliegwerk.com'
    },
    transport,
    views: {
        root: path.resolve(__dirname, '../../views/email')
    }
});
