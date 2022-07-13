_common = require('./../config/socket.emit');
var io = require('socket.io-client'),
    socket = io('http://134.209.149.86:7501');
moment = require("moment")
// Register AND Login with social
var login = {
    "Name" : "Data", "UserId" : "TEST67643467561", "Age": "fg", "Country": "UH", "Gender": "Male", "IsSocial": true
};

// var login = {"IsSocial":true,"UserId":"365231515384979","Name":"Pako","Age":"5","Country":"india","Gender":"Male","Dip":"https://graph.facebook.com/365231515384979/picture?access_token=GGQVlZAVXg1Q1gxdlNLcTZAjVFZAOekI0cU9vS3BFdy1nSmNxS3dRWjFYeGNhV3FCTXdUV3hGRTFRbUxhYXRiZAkEzZAGVua3JaRndITE1lc2FQZAU9sa3NVdWpkM0xUeFRtUTVySkgycm9PamhzWGQzd01fc0xxRHRydDFwQjJvc0w2dEVxQQZDZD","Password":""}
socket.emit('req:login', login);
socket.on('res:login', (data)=> {
    console.log("Output " , JSON.stringify(data))
});
// console.log("**Socket.IO Version: " + require('socket.io/package').version);


// let startDate = moment().startOf('day');
// let addDays = moment(startDate).add(2, "days").endOf("day");

// console.log(startDate, addDays)

