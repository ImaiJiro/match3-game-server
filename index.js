_common = module.exports = require('./config/socket.emit');
require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

require('./connection/mongooconnection');
require('./config/cron.jobs.config')
//  Start Http Server
var httpServer = http.createServer(app);
IO = module.exports = require('socket.io')(httpServer);
httpServer.listen(process.env.PORT, () => {
  console.log("HTTP Server running on port ", `${process.env.PORT}`);
});
require("./api/index_api")(app);
require('./api/index')(IO);