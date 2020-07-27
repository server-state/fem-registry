//region Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const sassMiddleware = require('node-sass-middleware');
const trailingSlash = require('trailing-slash');

const indexRouter = require('./routes');
const devRouter = require('./routes/dev');
const apiRouter = require('./routes/api');
const maintainerRouter = require('./routes/maintainer');
const db = require('./db/conn');
//endregion

//region Basic Setup
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const SessionStore = require('express-session-sequelize')(session.Store);
app.use(session({
        secret: 'abc',
        store: new SessionStore({
            db,
        }),
        resave: false,
        saveUninitialized: false
    }
));

const slowDown = require("express-slow-down");

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 150, // allow 150 requests per 15 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 150:
    // request # 151 is delayed by  500ms
    // request # 152 is delayed by 1000ms
    // request # 153 is delayed by 1500ms
    // etc.
});

try {
    const src = path.join(__dirname, '..', 'node_modules', 'uikit', 'dist', 'js', 'uikit.min.js');
    const dist = path.join(__dirname, '..', 'public', 'js', 'uikit.min.js');

    if (!fs.existsSync(dist) || fs.statSync(src).mtimeMs > fs.statSync(dist).mtimeMs)
        fs.copyFileSync(
            src,
            dist
        );
} catch (e) {
    console.error(`Couldn't copy required JS`, e)
}

app.use(sassMiddleware({
    src: path.join(__dirname, '../public'),
    // includePaths: ['node_modules'],
    dest: path.join(__dirname, '../public'),
    indentedSyntax: false, // true = .sass and false = .scss
    debug: (process.env.NODE_ENV !== 'production'),
    sourceMap: true
}));
//endregion

//region Statically served stuff
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../image-store')));
//endregion

//region Routers
app.use('/', indexRouter);
app.use('/dev/', speedLimiter, trailingSlash({slash: true}), devRouter);
app.use('/api', apiRouter);
app.use('/maintainer/', speedLimiter, trailingSlash({slash: true}), maintainerRouter);
//endregion

//region Error Handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(
    /**
     *
     * @param {*} err
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    function (err, req, res) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
//endregion


module.exports = app;
