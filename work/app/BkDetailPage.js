var utils = require('./utils');
var express = require('express');
var router = express.Router();
var db = require('./db/models/index')

router.get('/recruitment/:id',(req,res,next)=>{
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
        utils.ReturnError(res,err);
    });
});

router.post('/add_member',async function(req,res,next){
    //validationでいいかも
    if(!req.body.recuit_id || !req.body.name){
        res.status(400).json({message : "id and name are empty."})
    }
    if(req.body.name == ""){
        res.status(400).json({message : "name is empty."})
    }

    // todo: idが存在しないときを書く(validation)
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

    const CurrentMemberCount = MemberCountProcess[0].dataValues.recuit_id_count;
    const MaxMemberCount = MemberCountProcess[1].dataValues.member_cnt;
    if((MaxMemberCount != 0 || MaxMemberCount != null) && CurrentMemberCount >= MaxMemberCount){
        res.status(400).json({
            status: "NG",
            message: "MAX_MEMBER"
        });
    }
    else{
        let discription = "";
        if(discription in req.body){
            discription = req.body.discription;
        }
        db.Member.create({
            recuit_id: req.body.recuit_id,
            name: req.body.name,
            discription: discription
        }).then((result)=>{
            res.json({message: "OK"});
        }).catch((err)=>{
            utils.ReturnError(res,err);
        });
    }
});

router.post('/modify_member',(req,res,next)=>{
    //validation
    //値がないときなど

    db.Member.update(
        {
            name: req.body.name,
            discription: req.body.discription
        },
        {
            where: {
                id: req.body.id,
                recuit_id: req.body.recuit_id
            }
        }
    ).then((result)=>{
        res.json({message: "OK"});
    }).catch(e=>{
        utils.ReturnError(res,err);
    })
});

module.exports = router;