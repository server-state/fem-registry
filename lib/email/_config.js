const Email = require('email-templates');
const path = require('path');

/**
 * @type {import('email-templates').EmailTemplate<any>}
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
    // uncomment below to send emails in development/test env:
    // send: true
    transport: {
        jsonTransport: true
    },
    views: {
        root: path.resolve(__dirname, '../../views/email')
    }
});
