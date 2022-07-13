

module.exports = {
    sendMsgToUser: function (socket, en, msg) {
        socket.emit(en, msg);
    },

    sendMsgToAllUser: function (IO, roomname, en, msg) {
        try {
            IO.in(roomname).emit(en, msg);
        } catch (error) {
            socket.emit(en, msg);
        }
    },

    sendMsgToExceptUser: function (socket, roomname, en, msg) {
        try {
            socket.to(roomname).emit(en, msg);
        } catch (error) {
            socket.emit(en, msg);
        }
    }


};
