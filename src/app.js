//region Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const sassMiddleware = require('node-sass-middleware');
const trailingSlash = require('trailing-slash');

const indexRouter = require('./routes');
const devRouter = require('./routes/dev');
const apiRouter = require('./routes/api');
const maintainerRouter = require('./routes/maintainer');
const db = require('../db/conn');
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

app.use(sassMiddleware({
    src: path.join(__dirname, '../public'),
    dest: path.join(__dirname, '../public'),
    indentedSyntax: false, // true = .sass and false = .scss
    debug: !(process.env.NODE_ENV = 'production'),
    sourceMap: true
}));
//endregion

//region Statically served stuff
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../image-store')));
//endregion

//region Routers
app.use('/', indexRouter);
app.use('/dev/', trailingSlash({slash: true}), devRouter);
app.use('/api', apiRouter);
app.use('/maintainer/', trailingSlash({slash: true}), maintainerRouter);
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
