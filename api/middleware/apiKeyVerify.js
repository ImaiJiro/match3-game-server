const api_key = require("../../config/general_config.js");

module.exports.verify = ((req, res, next) => {

    let req_api_key = req.body.api_key;
    if(req_api_key != api_key.API_KEY){
        res.status(400).send({
            message: "API login is faild!"
          });
    }else{
        next();
    }
});