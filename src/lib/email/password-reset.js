const email = require('./_config'); // An email object

/**
 * Sends an email with the reset link to the user. Does not handle the password reset, but just sending the Email
 * @param {import('../../model/Publisher')} user
 * @param {string} link
 * @returns {Promise<*>}
 */
module.exports = async function sendPasswordResetMail(user, link) {
    const name = user.name; // The user's name

    return await email.send({
        template: 'password-reset',
        message: {
            to: user.email
        },
        locals: {
            name,
            link
        }
    })
};
