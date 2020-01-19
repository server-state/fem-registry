module.exports = async function sendEmailVerification(user, newEmail, verificationLink) {
    const url = (new URL(verificationLink)).origin;
    const name = user.name;

    const email = require('./_config')();

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
