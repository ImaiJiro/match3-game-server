_common = require('./../config/socket.emit');
var io = require('socket.io-client'),
    socket = io('http://localhost:7501');

// Bet
var bet = {
    "UserId": "USER_20", "Country": "UH", "ProfilePicUrl": "Data"
};
socket.emit('req:jointTournament', bet);
socket.on('res:jointTournament', (data)=> {
    console.log("Output " , data)
});

socket.on('res:anotherUserJointTournament', (data)=> {
    console.log("Second Output " , data)
});
