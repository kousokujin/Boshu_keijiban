var express = require('express');
var router = express.Router();
var db = require('./api/db/models/index');

router.get('/Recruitment/:id',async function(req,res){
    const id = req.params['id'];
    let recuitment_info  = await db.Recruitment.findOne({where:{id: id}});

    let discription = recuitment_info.dataValues.discription;
    const title = "UENO - " + recuitment_info.dataValues.name;

    if(discription.length < 1){
        discription = '募集サイト的な';
    }

    data = {
        title: title,
        discription: discription,
        url: GetFullURL(req),
        host: GetHostURL(req),
    };
    res.render("./layout.ejs",data);
});

router.get(/.*/,(req, res)=>{
    data = {
        url: GetFullURL(req),
        host: GetHostURL(req),
    }

    res.render("./layout.ejs",data);
});

function GetHostURL(req){
    return req.protocol + '://' + req.get( 'host' );
}

function GetFullURL(req){
    return  GetHostURL(req) + req.originalUrl;
}

module.exports = router;