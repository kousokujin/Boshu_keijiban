var Editor = require('./api/BkEditor.js');
var DetailPage = require('./api/BkDetailPage.js');
var SearchList = require('./api/BkList.js');

function router(app){
    app.use('/api',Editor);
    app.use('/api',DetailPage);
    app.use('/api',SearchList);
}

module.exports = router;