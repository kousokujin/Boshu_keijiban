var utils = require('./utils');
var express = require('express');
var router = express.Router();
var db = require('./db/models/index');
const { Op } = require("sequelize");

const PAGE_NUM = 10;

router.get('/search',(req,res,next)=>{
    
    let where = {};
    let page = 0;
    if(req.query.page != null && !isNaN(req.query.page)){
        page = Number(req.query.page);
    }
    
    if(req.query.SearchWord){
        where = {
            [Op.or]: [
                {name: { [Op.like]: '%'+req.query.SearchWord+'%' }},
                {owner: { [Op.like]: '%'+req.query.SearchWord+'%' }}
            ]
        }
    }
    db.Recruitment.findAll({
        where: where,
        order: [
            ['updatedAt','DESC'],
        ],
        limit: PAGE_NUM,
        offset: PAGE_NUM * page
    }).then((result)=>{
        let recruitment_list = [];
        result.forEach((value)=>{
            let temp_recruit = {
                id: value.dataValues.id,
                name: value.dataValues.name,
                owner: value.dataValues.owner,
                discription: value.dataValues.discription,
                member_max: value.dataValues.member_cnt,
                createdAt: value.dataValues.createdAt,
                updatedAt: value.dataValues.updatedAt
            };
            recruitment_list.push(temp_recruit);
        });
        res.json(recruitment_list);
    }).catch((err)=>{
        utils.ReturnError(res,err);
    });
});
module.exports = router;