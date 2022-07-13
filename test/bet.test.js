_common = require('./../config/socket.emit');
var io = require('socket.io-client'),
    socket = io('http://134.209.149.86:7501');

// Bet
var bet = {
    "UserId" : "Data", 
    "Coins": 100,
    "Stars": 100,
    "Diamond": 200
};
socket.emit('req:bet', bet);
socket.on('res:bet', (data)=> {
    console.log("Output " , data)
});


