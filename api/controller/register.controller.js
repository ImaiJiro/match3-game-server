const { registerHelper } = require('../helper/register.helper');

module.exports = async (io, socket) => {
    const createUser = async (data) => {
        try {
            var resData;
            const { UserId } = data;
            // console.log("Request Datav " , JSON.stringify(data))
            if (!!UserId) {
                if (UserId.trim() === "") {
                    resData = {
                        "status": false,
                        "msg": "Please try again. "
                    }
                    _common.sendMsgToUser(socket, "res:login", resData);
                } else {
                    data.SocketId = socket.id;
                    resData = await registerHelper(data);
                    _common.sendMsgToUser(socket, "res:login", resData);
                }
            } else {
                resData = {
                    "status": false,
                    "msg": "Please try again. "
                }
                _common.sendMsgToUser(socket, "res:login", resData);
            }
        } catch (error) {
            _common.sendMsgToUser(socket, "res:login", error);
        }
    };
    socket.on("req:login", createUser);
    return {
        createUser
    };
};