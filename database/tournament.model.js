var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tournamentSchema = new Schema({
    TournamentName: { type: String },
    ParticipateList: [{
        Name: { type: String },
        UserId: { type: String },
        Gender: { type: String },
        IsSocial: { type: Boolean }, 
        Country: { type: String },
        ProfilePicUrl: { type: String },
        SocketId: { type: String },
        RoomName: { type: String },
        PlayerCurrentRound: { type: Number, default: 1 },
        NextRoundEligibility: { type: Boolean, default: true },
        RoundPlayed: { type: Boolean, default: false },
        IsEmpty: { type: Number, default: 0 },
        Points: { type: Number, default: 0 }
    }],
    UserRoundStatus: [{
        Name: { type: String },
        UserId: { type: String },
        Gender: { type: String },
        IsSocial: { type: Boolean }, 
        Country: { type: String },
        ProfilePicUrl: { type: String },
        SocketId: { type: String },
        RoomName: { type: String },
        RoundPlayed: { type: Boolean, default: false },
        IsEmpty: { type: Number, default: 0 },
        Points: { type: Number, default: 0 },
        PlayerCurrentRound: { type: Number, default: 1 },
        NextRoundEligibility: { type: Boolean, default: false },
        PlayStatus: { type: String, enum: ["WIN", "LOSE", "QUIT", "START"], default: "START" }
    }],
    winUserId: {
        type: Array
    },
    TotalRound: { type: Number, default: 3 },
    CurrentRound: { type: Number, default: 0 },
    TournamentStatus: { type: String, enum: ["PENDING", "START", "COMPLETE"], default: "PENDING" },
    RoundStatus: { type: String, enum: ["QUARTER", "SEMIFINAL", "FINAL"], default: "QUARTER" },
    CreateDate: { type: Date },
    UpdateDate: { type: Date }
}, { strict: false, versionKey: false });
var Tournament = mongoose.model('TOURNAMENT', tournamentSchema);
module.exports = Tournament;