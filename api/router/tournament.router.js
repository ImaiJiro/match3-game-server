module.exports = async (io, socket) => {
    (await require('../controller/tournament.controller')(io, socket)); // Tournament

    (await require('../controller/disconnect.controller')(io, socket)); // Disconnect User
};
