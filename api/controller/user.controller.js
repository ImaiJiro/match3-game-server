// const User = require("../models/user.model.js");
let User = require("../../database/user.model");
let StickerType = require("../../database/sticker.type.model");
let StickerAlbum = require("../../database/sticker.album.model");
// User Register

exports.user_info = (req, res) => {
  // Validate request
  let _id = req.body._id;
  if (!req.body) {
    res.status(400).send({
      msg: "Content can not be empty!"
    });
  }
  User.findOne({ _id: `${_id}` }, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(500).send({
        msg: "server_error"
      });
    }
    else {
      res.send(docs);
    }
  });
};

exports.get_sticker_type = (req, res) => {
  // Validate request
  StickerType.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(500).send({
        msg: "server_error"
      });
    }
    else {
      res.send(docs);
    }
  });
};

exports.get_album_data = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "Content can not be empty!"
    });
  }

  let user_id = req.body.user_id;
  let album_num = req.body.album_num;
  let page_num = req.body.page_num;

  StickerAlbum.find({ "user_id": `${user_id}`, "page_num": page_num, "album_num": album_num }, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(500).send({
        msg: "server_error"
      });
    }
    else {
      res.send(docs);
    }
  });
};

exports.update_level = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "Content can not be empty!"
    });
  }

  let user_id = req.body.user_id;

  User.findById(user_id, function (err, docs) {
    if (!docs)
      res.send({ msg: "no_member" });
    else {

      User.updateOne({ _id: user_id }, { $set: { album_level: docs.album_level + 1 } }, function (err, res1) {
        if (err)
          res.send({ msg: "server_error" });
        res.send({ msg: "level_update_success" });
      });
    }
  });
};

exports.register = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "Content can not be empty!"
    });
  }

  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  User.findOne(username, (err, data) => {
    if (err)
      res.status(500).send({
        msg: "server_error"
      });
    else {
      if (data.msg == "already_exist") {
        res.send(data);
      } else if (data.msg == "not_found") {
        User.CreatOne(username, password, email, (err, data) => {
          if (err) {
            res.status(500).send({
              msg: "server_error"
            });
          } else {
            res.send(data);
          }
        })
      }
    }
  });
};

// User Login
exports.login = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      msg: "Content can not be empty!"
    });
  }

  let username = req.body.username;
  let password = req.body.password;

  User.login(username, password, (err, data) => {
    if (err)
      res.status(500).send({
        msg: "server_error"
      });
    else res.send(data);
  });
};







