const { jointTournamentHelper, leaveTournamentHelper, winTournamentHelper } = require('../helper/tournament.helper');

module.exports = async (io, socket) => {
    const jointTournamentController = async (data) => {
        try {
            data.SocketId = socket.id;
            var resData = await jointTournamentHelper(socket, data);
            if (data.status == false)
                _common.sendMsgToUser(socket, "res:jointTournament", resData);
        } catch (error) {
            _common.sendMsgToUser(socket, "res:jointTournament", error);
        }
    };
    socket.on("req:jointTournament", jointTournamentController);



    const leaveTournamentController = async (data) => {
        try {
            data.SocketId = socket.id;
            var resData = await leaveTournamentHelper(socket, data);
            if (data.status == false)
                _common.sendMsgToUser(socket, "res:leaveTournament", resData);
        } catch (error) {
            _common.sendMsgToUser(socket, "res:leaveTournament", error);
        }
    };
    socket.on("req:leaveTournament", leaveTournamentController);


    const winTournamentController = async (data) => {
        try {
            data.SocketId = socket.id;
            var resData = await winTournamentHelper(socket, data);
            if (data.status == false)
                _common.sendMsgToUser(socket, "res:finishRoundTournament", resData);
        } catch (error) {
            _common.sendMsgToUser(socket, "res:finishRoundTournament", error);
        }
    };
    socket.on("req:finishRoundTournament", winTournamentController);


    return {
        jointTournamentController,
        leaveTournamentController,
        winTournamentController 
    };
};