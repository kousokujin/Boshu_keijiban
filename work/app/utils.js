const utils = {
    ReturnError(response,err){
        console.log(err);
        response.status(500).json({
            "status": "NG"
        });
    }
}

module.exports = utils