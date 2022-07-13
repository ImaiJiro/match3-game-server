var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dailySchema = new Schema({
    Type: { type: String },
    Name: { type: String },
    IsLock: { type: Boolean },
    Counter: { type: Number },
    Id: {type: Number},
    EndDate: { type: Date },
    IsSelect: {type: Boolean},
    UnlockValue: {type: Number},
    CurrentDay: {type: Number},
}, { strict: false, versionKey: false });
var Daily = mongoose.model('BOOTSTERPERKS', dailySchema, 'bootsterperks');
module.exports = Daily;
