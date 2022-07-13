_common = require('./../config/socket.emit');
var io = require('socket.io-client'),
    socket = io('http://134.209.149.86:7501');

// Booster
// var bet = {
//     "UserId" : "TETSSSSDDTS",
//     "Type": "BOOSTER",
//     "IsLock": true,
//     "Count": 0,
//     "_id": "62a98d2f7811bc7fa606f4fb"
// };
// Perks
// var bet = {
//     "UserId" : "TETSSSSDDTS",
//     "Type": "PERKS",
//     "IsLock": true,
//     "Count": 0,
//     "_id": "62a98d2f7811bc7fa606f509"
// };
var bet = {
    "UserId":"TEST",
    "Type":"PERKS",
    "IsLock":true,
    "Count": -4,
    "_id":"62b43a78bacd6bac52414856"
}
socket.emit('req:lockcounter', bet);
socket.on('res:lockcounter', (data)=> {
    console.log("Output " , JSON.stringify(data))
});

// "boostername": "The Slime",
// "islock": true,
// "counter": 0,
// "booster_id": 4,
// "_id": "62a98d2f7811bc7fa606f4fb"