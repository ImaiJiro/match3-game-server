const { getHelper } = require('../helper/leaderboard.helper');

module.exports = async (io, socket) => {
    const getController = async (data) => {
        try {
            var resData = await getHelper(data);
            _common.sendMsgToUser(socket, "res:leader", resData);
        } catch (error) {
            _common.sendMsgToUser(socket, "res:leader", error);
        }
    };
    socket.on("req:leader", getController);
    return {
        getController
    };
};