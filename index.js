var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var usersRoute = require('./routes/user');

var app = express();
const URI = 'mongodb+srv://claudio:'
    + process.env.MONGO_PW + 
        '@node-composer-lhxzj.gcp.mongodb.net/test?retryWrites=true';

mongoose.connect(URI, {
    dbName: "testing"
})
    .then(db => console.log('db is connected'))
    .catch(err => console.error(err));

mongoose.Promise = global.Promise;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/user', usersRoute);

// catch 404 and forward to error handler
/*
app.use(function (req, res, next) {
    return res.render('index');
});
*/

//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
 port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
 console.log('app running on port: %d', port);
});
