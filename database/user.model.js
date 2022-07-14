var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    Name: { type: String },
    Age: { type: String },
    Country: { type: String },
    Gender: { type: String },
    Coins: { type: Number, default: 0 },
    Stars: { type: Number, default: 0 },
    Diamond: { type: Number, default: 0 },
    Trophy: { type: Number, default: 0 },
    IsSocial: { type: Boolean },
    UserId: { type: String },
    ProfilePicUrl: { type: String },
    CreateDate: { type: Date },
    UpdateDate: { type: Date },
    Booster: [{
        boostername: { type: String },
        islock: { type: Boolean },
        counter: { type: Number },
        booster_id: { type: Number }
    }],
    Perks: [{
        perkname: { type: String },
        islock: { type: Boolean },
        counter: { type: Number },
        perk_id: { type: Number }
    }],
    EventDetails: [{ 
        "Name" : { type: String },
        "IsLock" : { type: Boolean },
        "Counter" : { type: Number },
        "Id" : { type: Number },
        "IsSelect" : { type: Boolean },
        "Type" : { type: String },
        "EndDate" : { type: Date },
        "CurrentDay" : { type: Number },
        "UnlockValue" : { type: Number }
     }],
    Light: { type: Number, default: 0 },
    diamonds : { type: String },
    gold : { type: String },
    silver : { type: String },
    white : { type: String },
    album_level : { type: Number },
    
    EndDate: { type: Date },
}, { strict: false, versionKey: false });
var User = mongoose.model('USER', userSchema, 'users');
module.exports = User;
