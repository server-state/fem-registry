# Configuration
The project uses one main configuration file: `config.json`.

This has to exist when running the server in production mode and defines DB credentials (outside production mode, it will use an in-memory SQLite3 DB), email credentials and some constants.

**Since this file contains multiple credentials, it is of the utmost importance that it isn't exposed via a web server or similar vectors.**

All of this is stored as a JSON object in the `config.json` file. This object contains the following properties:


## `config.json` properties
### `db: object`
The database configuration. We pass this directly into the Sequelize constructor, meaning all the properties of this are documented at https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor.

### `smtp: object`
The SMTP configuration. Gets passed directly into `nodemailer.createTransport`, meaning you can find documentation about this at https://nodemailer.com/smtp/#examples.

##### Example:

```
{
  "smtp": {
    "host": "localhost",
    "secure": false,
    "port": 25,
    "auth": {
      "user": "newuser",
      "pass": "12345"
    }
  },
  [...]
}
```

### `constants: object`
A few constants that get used by the system:

- `signUpVerificationLinkExpiryAfterMinutes` - the amount of time (in minutes) before a newly created email verification link expires after signing up
- `emailChangeVerificationLinkExpiryAfterMinutes` - the amount of time (in minutes) before a newly created email verification link expires after changing the email address of a developer account
- `passwordResetLinkExpiryAfterMinutes` - the amount of time (in minutes) before a newly created email verification link expires after submitting the "Password Reset" form for a developer account.
##### Example: 
```
{
  "constants": {
    "signUpVerificationLinkExpiryAfterMinutes": 30,
    "emailChangeVerificationLinkExpiryAfterMinutes": 10,
    "passwordResetLinkExpiryAfterMinutes": 10
  },
  [...]
}
```

## Editing the file
It is strongly recommended to only edit the file if you know what you're doing. To set this file up in a new environment, please use the interactive setup script in `./bin/setup`.
