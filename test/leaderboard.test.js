_common = require('./../config/socket.emit');
var io = require('socket.io-client'),
    socket = io('http://134.209.149.86:7501');

// Leaderboard
var leaderboard = {
    "Country" : "UH"
};
socket.emit('req:leader', leaderboard);
socket.on('res:leader', (data)=> {
    console.log("Output " , data)
});