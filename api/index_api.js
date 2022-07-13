module.exports = app => {
  const user = require("./controller/user.controller.js");
  const api_key = require("./middleware/apiKeyVerify.js");

  var router = require("express").Router();

  //Get User Info
  router.post("/user_info", api_key.verify, user.user_info);

  //Get sticker type
  router.post("/get_sticker_type", api_key.verify, user.get_sticker_type);

  //User get Album Data
  router.post("/get_album_data", api_key.verify, user.get_album_data);

  //User Update Album Level
  router.post("/update_level", api_key.verify, user.update_level);

  app.use('/api', router);
};
