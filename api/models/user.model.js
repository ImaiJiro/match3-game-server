// const sql = require("./db.js");

// constructor
// const User = function (user) {
//   this.title = tutorial.title;
//   this.description = tutorial.description;
//   this.published = tutorial.published;
// };

// User.findOne = (username, result) => {
//   sql.query(`SELECT * FROM tbl_user WHERE username = '${username}'`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, { msg: "already_exist" });
//       return;
//     }

//     // not found member with the same id
//     result(null, { msg: "not_found" });
//   });
// };

// User.login = (username, password, result) => {
//   sql.query(`SELECT * FROM tbl_user WHERE username = '${username}' && password = '${password}'`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, { msg: "login_success", data: res[0] });
//       return;
//     }

//     // not found member with the id and password
//     result(null, { msg: "no_member" });
//   });
// };

// User.user_info = (user_id, result) => {
//   sql.query(`SELECT * FROM tbl_user WHERE id = '${user_id}'`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, { msg: "success", data: res[0] });
//       return;
//     }

//     // not found member with the id and password
//     result(null, { msg: "no_member" });
//   });
// };

// User.update_level = (user_id, result) => {
//   sql.query(`Update tbl_user set album_level = album_level + 1 where id = ${user_id}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.affectedRows) {
//       result(null, { msg: "level_update_success"});
//       return;
//     }

//     // not found member with the id and password
//     result(null, { msg: "no_member" });
//   });
// };

// User.get_album_data = (user_id, album_num, page_num, result) => {
//   let queryStr = `Select * from tbl_stickers where user_id = ${user_id} and album_num = '${album_num}' and page_num = '${page_num}'`;
//   console.log(queryStr);
//   sql.query(queryStr, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     result(null, { msg: "result_array", data: res });
//   });
// };

// User.get_sticker_type = (user_id, result) => {
//   let queryStr = `Select * from tbl_sticker_type`;
//   console.log(queryStr);
//   sql.query(queryStr, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     result(null, { msg: "result_array", data: res });
//   });
// };

// User.CreatOne = (username, password, email, result) => {
//   sql.query(`Insert into tbl_user (username, password, email, status, created_at, point, diamond, gold, silver, white, album_level) values ('${username}', '${password}', '${email}', 1, CURDATE(), 0, '0,', '0,', '0,', '0,', 1)`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.affectedRows) {
//       result(null, { msg: "regist_success" });
//       return;
//     }

//     // not found Tutorial with the id
//     result(null, { msg: "regist_failed" });
//   });
// };
// module.exports = User;
