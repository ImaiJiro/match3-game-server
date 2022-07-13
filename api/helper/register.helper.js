const { insertOne } = require("../services/register.services");


async function registerHelper(params) {
    try {
        var responseHelper = await insertOne(params);
        return responseHelper;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { registerHelper };