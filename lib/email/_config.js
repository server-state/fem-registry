const Email = require('email-templates');
const path = require('path');

module.exports = function newEmail() {
    return new Email({
        message: {
            from: 'niftylettuce@gmail.com'
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
};
