module.exports = app => {
    const user = require("../controllers/user.controller.js");
    const api_key = require("../middleware/apiKeyVerify.js");
  
    var router = require("express").Router();
  
    // User Register
    router.post("/register", api_key.verify, user.register);
  
    //User Login
    router.post("/login", api_key.verify, user.login);
  
    //Get User Info
    router.post("/user_info", api_key.verify, user.user_info);
  
    //User Update Album Level
    router.post("/update_level", api_key.verify, user.update_level);
  
    //User get Album Data
    router.post("/get_album_data", api_key.verify, user.get_album_data);
  
    //Get sticker type
    router.post("/get_sticker_type", api_key.verify, user.get_sticker_type);
  
    app.use('/api', router);
  };
  