var utils = require('./utils');
var express = require('express');
var router = express.Router();
var db = require('./db/models/index')


router.post('/apply/:id',(req,res,next) => {
    const id = req.params['id'];
    if(id == "new"){
        db.Recruitment.create({
            name: req.body.name,
            owner: req.body.owner,
            member_cnt: req.body.member_count,
            discription: req.body.discription
        }).then(async function(db_result){
            if(req.body.owner_join == true){
                await db.Member.create({
                    recuit_id: db_result['id'],
                    name: req.body.owner,
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
    }
    else{
        // modify
        db.Recruitment.update({
            name: req.body.name,
            owner: req.body.owner,
            member_cnt: req.body.member_count,
            discription: req.body.discription

        },
        {
            where: {id: id}
        }).then((result)=>{
            res.json({
                status: "ok",
                id: id
            });
        }).catch((err)=>{
            utils.ReturnError(err);
        })
    }
});

router.get('/recruitment_editdata/:id',(req,res,next)=>{
    const id = req.params['id'];
    db.Recruitment.findOne({where:{id: id}}).then((result)=>{
        if(result == null){
            res.status(404).json({message: "This id is not exist."});
        }
        else{
            let return_request = {
                id: result.dataValues.id,
                name: result.dataValues.name,
                owner: result.dataValues.owner,
                discription: result.dataValues.discription,
                member_max: result.dataValues.member_cnt,
                createdAt: result.dataValues.createdAt,
                updatedAt: result.dataValues.updatedAt,
                _csrf: req.csrfToken()
            };

            res.json(return_request);
        }
    }).catch((e)=>{
        utils.ReturnError(res,err);
    });
});

router.get('/token',(req,res,next)=>{
    res.json({_csrf: req.csrfToken()});
});

module.exports = router;