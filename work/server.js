const express = require('express')
const app = express()
var csrf = require('csurf');
const session = require('express-session');
const config = require('./config/config.js');

var app_router = require('./backend/router.js');
var frame = require('./backend/frame.js');

app.set("view engine", "ejs");
app.use(express.json());
app.use(session({
    secret: 'xdafesdf34',
    reserve: true,
    cookie: {maxAge : 1200000},
    saveUninitialized: true
}));

app.use('/img', express.static(__dirname + '/dist/img/'));
app.use('/css', express.static(__dirname + '/dist/css/'));
app.use('/js', express.static(__dirname + '/dist/js/'));
app.use('/fonts', express.static(__dirname + '/dist/fonts/'));

app.use(csrf({cookie: false}));

app_router(app);
app.use('/',frame);

app.listen(config.app_port, () => console.log('Start Backend Server on port '+config.app_port));