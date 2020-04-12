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
// const apiRouter = require('./routes/api');
const maintainerRouter = require('./routes/maintainer');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'abc'}));
app.use(sassMiddleware({
    src: path.join(__dirname, '../public'),
    dest: path.join(__dirname, '../public'),
    indentedSyntax: false, // true = .sass and false = .scss
    debug: true,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../image-store')));

app.use('/', indexRouter);
app.use('/dev/', trailingSlash({slash: true}), devRouter);
// app.use('/api', apiRouter);
app.use('/maintainer/', trailingSlash({slash: true}), maintainerRouter);

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

require('../db/conn');

module.exports = app;
