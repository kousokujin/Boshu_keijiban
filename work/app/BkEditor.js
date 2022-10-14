var utils = require('./utils');
var express = require('express');
var router = express.Router();
var db = require('./db/models/index')
const { check, validationResult } = require('express-validator/check');


const ApplyPageValidate = [
    check('id').not().isEmpty(),
    check('name').not().isEmpty().isLength({min: 1,max:20}),
    check('owner').not().isEmpty().isLength({min: 1,max:20}),
];
router.post(
    '/apply/:id',
    ApplyPageValidate,
    (req,res,next) => {

    const ValidateErrors= validationResult(req);
    if(!ValidateErrors.isEmpty()){
        utils.ValdiateError(res,ValidateErrors);
    }
    const id = req.params['id'];
    const remote_ip = utils.getRemoteIP(req);
    if(id == "new"){
        db.Recruitment.create({
            name: req.body.name,
            owner: req.body.owner,
            member_cnt: req.body.member_count,
            discription: req.body.discription,
            IPaddr: remote_ip
        }).then(async function(db_result){
            const history_data = {
                name: req.body.name,
                owner: req.body.owner,
                member_cnt: req.body.member_count,
                discription: req.body.discription,
            }
            utils.history.create(utils.db_name.recruitment,db_result["id"],history_data,remote_ip);
            if(req.body.owner_join == true){
                const member_result = await db.Member.create({
                    recuit_id: db_result['id'],
                    name: req.body.owner,
                    discription: "",
                    IPaddr: remote_ip
                });
                const history_member = {
                    recuit_id: db_result['id'],
                    name: req.body.owner,
                    discription: ""
                }
                utils.history.create(utils.db_name.member,member_result["id"],history_member,remote_ip);
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
            discription: req.body.discription,
            IPaddr: remote_ip

        },
        {
            where: {id: id}
        }).then(()=>{
            const hisory_db = {
                name: req.body.name,
                owner: req.body.owner,
                member_cnt: req.body.member_count,
                discription: req.body.discription,
            }
            utils.history.modify(utils.db_name.recruitment,id,hisory_db,remote_ip);
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