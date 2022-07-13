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
    EventDetails: { type: Schema.Types.Mixed },
    Light: { type: Number, default: 0 },
    
    EndDate: { type: Date },
}, { strict: false, versionKey: false });
var User = mongoose.model('USER', userSchema);
module.exports = User;
