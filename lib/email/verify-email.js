const email = require('./_config'); // An email object

/**
 * Sends a promise for the specified `user` to the new `newEmail` email address in order to verify this email.
 * 
 * Can get used for changing an existing user's email address or for verifying newly registered users
 * @param {User} user
 * @param {string} newEmail
 * @param {string} verificationLink
 * @returns {Promise<*>}
 */
module.exports = async function sendEmailVerification(user, newEmail, verificationLink) {
    const url = (new URL(verificationLink)).origin; // The server url, used in the text of the email
    const name = user.name; // The user's name

    return await email.send({
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
