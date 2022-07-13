const { updateService, lockService, counterService } = require("../services/bet.services");

async function updateHelper(params) {
    try {
        var updateServices = await updateService(params);
        return updateServices;
    } catch (error) {
        // console.log(error)
        return {
            status: false,
            msg: error
        };
    }
}

async function lockHelper(params) {
    try {
        var updateServices = await lockService(params);
        return updateServices;
    } catch (error) {
        // console.log(error)
        return {
            status: false,
            msg: error
        };
    }
}

async function counterHelper(params) {
    try {
        var updateServices = await counterService(params);
        return updateServices;
    } catch (error) {
        // console.log(error)
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { updateHelper, lockHelper, counterHelper };