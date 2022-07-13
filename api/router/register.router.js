module.exports = async (io, socket) => {
    (await require('../controller/register.controller')(io,socket)); // Register and login
};