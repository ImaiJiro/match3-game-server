module.exports = async (io, socket) => {
    (await require('../controller/bet.controller')(io,socket));
};