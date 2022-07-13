var User = require('./../../database/user.model');

async function getService(params) {
    try {
        let resData;
        const { Country, Type } = params;
        const getListUsers = await User.find({ Country: Country.toUpperCase() }).sort({ Trophy: -1 }).limit(100);
        const getAllUsers = await User.find({}).sort({ Trophy: -1 }).limit(50);
        if (Type.toUpperCase() == "ALL") {
            resData = {
                "status": true,
                "msg": "List Show Successfully.",
                "all": getAllUsers
            }
        } else {
            resData = {
                "status": true,
                "msg": "List Show Successfully.",
                "country": getListUsers
            }
        }

        console.log(JSON.stringify(resData))
        return resData;
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { getService };