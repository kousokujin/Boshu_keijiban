const express = require('express')
const app = express()
var csrf = require('csurf');
const session = require('express-session');

var Editor = require('./app/BkEditor.js');
var DetailPage = require('./app/BkDetailPage.js');
var SearchList = require('./app/BkList.js');

app.listen(3000, () => console.log('Start Backend Server on port 3000!'))
app.use(express.json());
app.use(session({
    secret: 'xdafesdf34',
    reserve: true,
    cookie: {maxAge : 1200000},
    saveUninitialized: true
}));
app.use(csrf({cookie: false}));

app.use('/api',Editor);
app.use('/api',DetailPage);
app.use('/api',SearchList);