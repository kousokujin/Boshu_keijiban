var utils = require('./utils');
var express = require('express');
var router = express.Router();
var db = require('./db/models/index')


router.post('/apply/:id',(req,res,next) => {
    db.Recruitment.create({
        name: req.body.Title,
        owner: req.body.Owner,
        member_cnt: req.body.MemberCount,
        discription: req.body.Discription
    }).then(async function(db_result){
        if(req.body.owner_join == true){
            await db.Member.create({
                recuit_id: db_result['id'],
                name: req.body.Owner,
                discription: ""
            });
        }
        res.json({
            status: "ok",
            id: db_result["id"]
        });
    }).catch((err)=>{
        utils.ReturnError(res,err);
    });
});

router.get('/token',(req,res,next)=>{
    res.json({_csrf: req.csrfToken()});
});

module.exports = router;