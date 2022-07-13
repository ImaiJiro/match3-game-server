module.exports = async (io, socket) => {
    (await require('../controller/leaderboard.controller')(io,socket));
};