//// https://github.com/Automattic/mongoose/issues/9147 === Error connect Mongodb DigitalOcean - 
var mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;