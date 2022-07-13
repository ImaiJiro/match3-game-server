const { getService } = require("../services/leaderboard.services");

async function getHelper(params) {
    try {
        var getServices = await getService(params);
        return getServices;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { getHelper };