var utils = require('./utils');
var express = require('express');
var router = express.Router();
var db = require('./db/models/index')
const { check, validationResult } = require('express-validator/check');

router.get('/recruitment/:id',(req,res,next)=>{
    const id = req.params['id'];
    db.Recruitment.findOne({where:{id: id}, order: [['createdAt', "ASC"]]}).then((result)=>{
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
                members: [],
                _csrf: req.csrfToken()
            };
            db.Member.findAll({where: {recuit_id: id}}).then((m)=>{
                m.forEach((value,index,array)=>{
                    let temp_mem = {
                        id: value.dataValues.id,
                        name: value.dataValues.name,
                        discription: value.dataValues.discription,
                        createdAt: value.dataValues.createdAt,
                        updatedAt: value.dataValues.updatedAt
                    }
                    return_request.members.push(temp_mem);
                });
                if(return_request.member_max == null){
                    return_request.member_max = 0;
                }
                res.json(return_request);
            });
        }
    }).catch((e)=>{
        utils.ReturnError(res,e);
    });
});

const AddMemberValidators = [
    check('recuit_id').not().isEmpty(),
    check('name').not().isEmpty().isLength({min:1,max:20}),
];
router.post('/add_member',AddMemberValidators,async function(req,res,next){

    const ValidateErrors= validationResult(req);
    if(!ValidateErrors.isEmpty()){
        utils.ValdiateError(res,ValidateErrors);
    }

    const remote_ip = utils.getRemoteIP(req);

    let MemberCountProcess = await Promise.all([
        db.Member.findOne({
            where: {recuit_id: req.body.recuit_id},
            attributes: [
                'recuit_id',
                [db.sequelize.fn('COUNT', db.sequelize.col('recuit_id')), 'recuit_id_count']
            ],
            group: 'recuit_id'
        }),
        db.Recruitment.findOne({where:{id: req.body.recuit_id}})
    ]).catch((err)=>{
        utils.ReturnError(res,err);
    });

    const CurrentMemberCount = MemberCountProcess[0] == null ? 0 : MemberCountProcess[0].dataValues.recuit_id_count;
    const MaxMemberCount = MemberCountProcess[1].dataValues.member_cnt;
    console.log("member_cnt:"+MaxMemberCount);
    if(MaxMemberCount != 0 && CurrentMemberCount >= MaxMemberCount){
        res.status(400).json({
            status: "NG",
            message: "MAX_MEMBER"
        });
    }
    else{
        db.Member.create({
            recuit_id: req.body.recuit_id,
            name: req.body.name,
            discription: req.body.discription,
            IPaddr: remote_ip
        }).then((x)=>{
            const history_data = {
                recuit_id: req.body.recuit_id,
                name: req.body.name,
                discription: req.body.discription,
            }
            utils.history.create(utils.db_name.member,x["id"],history_data,utils.getRemoteIP(req));
            res.json({message: "OK"});
        }).catch((err)=>{
            utils.ReturnError(res,err);
        });
    }
});

const ModifyMemberValidation = [
    check('recuit_id').not().isEmpty(),
    check('id').not().isEmpty(),
    check('name').not().isEmpty().isLength({min:1,max:20})
];
router.post('/modify_member',ModifyMemberValidation ,(req,res,next)=>{
    const ValidateErrors= validationResult(req);
    if(!ValidateErrors.isEmpty()){
        utils.ValdiateError(res,ValidateErrors);
    }

    const remote_ip = utils.getRemoteIP(req);
    db.Member.update(
        {
            name: req.body.name,
            discription: req.body.discription,
            IPaddr: remote_ip
        },
        {
            where: {
                id: req.body.id,
                recuit_id: req.body.recuit_id
            }
        }
    ).then(()=>{
        utils.history.modify(
            utils.db_name.member,
            req.body.id,
            {
                name: req.body.name,
                discription: req.body.discription,
            },
            remote_ip
        );
        res.json({message: "OK"});
    }).catch(err=>{
        utils.ReturnError(res,err);
    })
});

const DeleteRecruitmentValidation = [
    check('id').not().isEmpty()
]
router.post('/delete/recruitment',DeleteRecruitmentValidation,(req,res,next)=>{
    const ValidateErrors= validationResult(req);
    if(!ValidateErrors.isEmpty()){
        utils.ValdiateError(res,ValidateErrors);
    }

    const id = req.body.id;
    const remote_ip = utils.getRemoteIP(req);
    db.Recruitment.findOne({where:{id: id}}).then(async function(result){
        if(result == null){
            res.status(404).json({message: "This id is not exist."});
        }
        else{
            Promise.all([
                async function(){
                    await db.Member.destroy({where: {recuit_id: id}}).catch(err=>utils.ReturnError(res,err));
                    await result.destroy().catch(err=>utils.ReturnError(res,err));
                },
                utils.history.delete(utils.db_name.recruitment,id,remote_ip)
            ]).then(()=>{
                res.json({message: "OK"});
            }).catch((err)=>{
                utils.ReturnError(res,err);
            })
        }
    })
});

const DeleteMemberValidation = [
    check('member_id').not().isEmpty(),
    check('recuit_id').not().isEmpty()
]
router.post('/delete/member',DeleteMemberValidation,(req,res,next)=>{
    const ValidateErrors= validationResult(req);
    if(!ValidateErrors.isEmpty()){
        utils.ValdiateError(res,ValidateErrors);
    }
    const member_id = req.body.member_id;
    const recuit_id = req.body.recuit_id;
    const remote_ip = utils.getRemoteIP(req);

    db.Member.findOne({where: {id: member_id, recuit_id: recuit_id}}).then(async function(result){
        if(result == null){
            res.status(404).json({message: "This member is not exist."});
        }
        else{
            Promise.all([
                db.Member.destroy({where: {id: member_id, recuit_id: recuit_id}}),
                utils.history.delete(utils.db_name.member,member_id,remote_ip)
            ]).then(()=>{
                res.json({message: "OK"});
            }).catch((err)=>{
                utils.ReturnError(res,err);
            });
        }
    }).catch((e)=>{
        utils.ReturnError(res,e);
    });
});
module.exports = router;