module.exports = async (io, socket) => {
    (await require('../controller/disconnect.controller')(io, socket));
};