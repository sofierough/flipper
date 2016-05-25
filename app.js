var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
//sætter skemaerne i models igang via mongoose
require('./models/models');
var index = require('./routes/index');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose');

if(process.env.DEV_ENV){
    //Hvis vi kører lokalt vil denne forbindelse blive brugt via en environment variable
    mongoose.connect('mongodb://localhost/test-chirp');
}
else {
    //den online version vil automatisk vælge denne her, da jeg ikke har nogen lokal mongo db installeret, hvor jeg lægger den op.
    mongoose.connect('mongodb://sofierough:admin@ds036709.mlab.com:36709/flipper-app');
}

var app = express();

// views setup lavet med ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(session({
  secret: 'mantaray is nice'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

// error 404, sendes til error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Starter Passport som jeg bruger til authentication.js
var initPassport = require('./passport-init');
initPassport(passport);

// error handlers genereret med ejs
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
