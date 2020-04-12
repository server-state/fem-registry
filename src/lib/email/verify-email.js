const email = require('./_config'); // An email object
const URL = require('url').URL;

/**
 * Sends a promise for the specified `user` to the new `newEmail` email address in order to verify this email.
 *
 * Can get used for changing an existing user's email address or for verifying newly registered users
 * @param {import('../../model/Publisher')} user
 * @param {string} newEmail
 * @param {string} verificationLink
 * @returns {Promise<void>}
 */
module.exports = async function sendEmailVerification(user, newEmail, verificationLink) {
    const url = (new URL(verificationLink)).origin; // The server url, used in the text of the email
    const name = user.name; // The user's name

    await email.send({
        template: 'verify-email',
        message: {
            to: newEmail
        },
        locals: {
            name,
            url,
            verificationLink
        }
    })
};
