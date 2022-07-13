const registerRouter = require("./router/register.router");
const betRouter = require("./router/bet.router");
const leaderRouter = require("./router/leaderboard.router");
const tournamentRouter = require("./router/tournament.router");
module.exports = (IO) => {
  const onConnection = (socket) => {
    console.log("Sockect Id ", socket.id)
    socket.join("UpdateEventDetails")
    // Online Register And Login (Social {Google})
    registerRouter(IO, socket);
    // Bet User , perks and bootster
    betRouter(IO, socket);
    // Leaderboard
    leaderRouter(IO, socket);
    // Tournament
    tournamentRouter(IO, socket);
  };
  IO.on("connection", onConnection);
};
