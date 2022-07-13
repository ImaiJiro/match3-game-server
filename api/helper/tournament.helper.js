const { insertOne, leaveOneServices, winTournamentServices } = require("../services/tournament.services");

async function jointTournamentHelper(socket, params) {
    try {
        var responseHelper = await insertOne(socket, params);
        return responseHelper;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function leaveTournamentHelper(socket, params) {
    try {
        var responseHelper = await leaveOneServices(socket, params);
        return responseHelper;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function winTournamentHelper(socket, params) {
    try {
        var responseHelper = await winTournamentServices(socket, params);
        return responseHelper;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { jointTournamentHelper, leaveTournamentHelper, winTournamentHelper};