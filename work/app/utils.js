var db = require('./db/models/index')


function hisory_db(table_name,column_id,status,content,ipaddr){
    return db.history.create({
        table_name: table_name,
        status: status,
        Column_id: column_id,
        content: content,
        IPaddr: ipaddr
    });
}
const utils = {
    ReturnError(response,err){
        console.log(err);
        response.status(500).json({
            "status": "NG"
        });
    },
    ValdiateError(response, ValidateError){
        return response.status(422).json(ValidateError);
    },
    getRemoteIP(req){
        return  req.connection.remoteAddress || req.headers["x-forwarded-for"];
    },
    history: {
        modify(table_name,column_id,content,ipaddr = ""){
            return hisory_db(table_name,column_id,"MODIFY",content,ipaddr);
        },
        create(table_name,column_id,content,ipaddr = ""){
            return hisory_db(table_name,column_id,"CREATE",content,ipaddr);
        },
        delete(table_name,column_id,ipaddr = ""){
            return hisory_db(table_name,column_id,"DELETE",{},ipaddr);
        },
    },
    db_name: {
        member: "Member",
        recruitment: "Recruitment",
        history: "history"
    }
}

module.exports = utils