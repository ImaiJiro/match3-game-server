const { updateHelper, lockHelper, counterHelper } = require('../helper/bet.helper');

module.exports = async (io, socket) => {
    const updateController = async (data) => {
        try {
            var resData;
            const { Coins, UserId, Stars, Diamond, Light } = data;
            console.log(data)
            if (UserId !== undefined) {
                if (UserId.trim() === "") {
                    resData = {
                        "status": false,
                        "msg": "Please try again. "
                    }
                    _common.sendMsgToUser(socket, "res:updatecoins", resData);
                } else {
                    resData = await updateHelper(data);
                    _common.sendMsgToUser(socket, "res:updatecoins", resData);
                }
            } else {
                resData = {
                    "status": false,
                    "msg": "Please try again. "
                }
                _common.sendMsgToUser(socket, "res:updatecoins", error);
            }
        } catch (error) {

            console.log(error)
            _common.sendMsgToUser(socket, "res:updatecoins", error);
        }
    };
    socket.on("req:updatecoins", updateController);



    const lockController = async (data) => {
        try {
            var resData;
            const { UserId, Type, IsLock, Count, _id } = data;
            console.log(data)
            if (!!UserId) {
                if (UserId.trim() === "") {
                    resData = {
                        "status": false,
                        "msg": "Please try again. "
                    }
                    _common.sendMsgToUser(socket, "res:lockcounter", resData);
                } else {
                    resData = await lockHelper(data);
                    _common.sendMsgToUser(socket, "res:lockcounter", resData);
                }
            } else {
                resData = {
                    "status": false,
                    "msg": "Please try again. "
                }
                _common.sendMsgToUser(socket, "res:lockcounter", error);
            }
        } catch (error) {

            console.log(error)
            _common.sendMsgToUser(socket, "res:lockcounter", error);
        }
    };
    socket.on("req:lockcounter", lockController);


    const counterController = async (data) => {
        try {
            var resData;
            const { UserId, Type, IsLock, Count, _id } = params;
            console.log(data)
            if (!UserId) {
                if (UserId.trim() === "") {
                    resData = {
                        "status": false,
                        "msg": "Please try again. "
                    }
                    _common.sendMsgToUser(socket, "res:counter", resData);
                } else {
                    resData = await counterHelper(data);
                    _common.sendMsgToUser(socket, "res:counter", resData);
                }
            } else {
                resData = {
                    "status": false,
                    "msg": "Please try again. "
                }
                _common.sendMsgToUser(socket, "res:counter", error);
            }
        } catch (error) {

            console.log(error)
            _common.sendMsgToUser(socket, "res:counter", error);
        }
    };
    socket.on("req:counter", lockController);

    return {
        updateController,
        lockController
    };
};