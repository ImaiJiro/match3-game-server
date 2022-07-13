// const compression = require('compression');
const express = require('express');
// const cors = require('cors');
const app = express();
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// https://stackoverflow.com/questions/62396498/tslint-marks-body-parser-as-deprecated
// parse application/json
app.use(express.json());
// app.use(cors());
// app.use(compression());
// Middleware
app.use(function (req, res, next) {
    console.log(req.baseUrl);
    var err = {};
    err.status = 404;
    err.msg = "Not Found";
    next(res.status(404).json({data: "Error on Router"}));
});
module.exports = app;