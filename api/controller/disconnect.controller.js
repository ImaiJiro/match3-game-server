
var _ = require("lodash");
const Tournament = require("../../database/tournament.model");

module.exports = async (io, socket) => {
    socket.on("disconnect", async () => {
        console.log("--------------------------------------------")
        console.log("-------------Disconnet Tournament--------------")
        console.log("--------------------------------------------")
        let disSocketId = socket.id;
        let getTournament = await Tournament.findOne({ "ParticipateList.SocketId": socket.id }); // ParticipateList SocketId ParticipateList
        // console.log("Tournament " , getTournament);
        if (getTournament != null) {
            let name = getTournament.TournamentName;
            let currentRound = getTournament.CurrentRound;
            if (getTournament.TournamentStatus == "PENDING") {
                if (getTournament.ParticipateList.length > 1) {
                    let updateTournament = await Tournament.findOneAndUpdate({ TournamentName: name }, {
                        $pull: {
                            "ParticipateList": { "SocketId": disSocketId }
                        }
                    }, { new: true });
                    var RoundList = [];
                    RoundList.push({
                        "PlayerList": updateTournament.ParticipateList
                    });
                    for (let index = 0; index < updateTournament.TotalRound - 1; index++) {
                        RoundList.push({
                            "PlayerList": []
                        });
                    }
                    resData = {
                        status: true,
                        msg: "Leave Tournament",
                        RoundList: RoundList,
                        mainRoom: updateTournament.TournamentName,
                        TournamentName: updateTournament.TournamentName
                    };
                    _common.sendMsgToExceptUser(socket, name, "res:leaveTournamentAnotherPlayer", resData);

                } else {
                    await Tournament.findOneAndDelete({ TournamentName: name });
                }
                socket.leave(name);
            } else if (getTournament.TournamentStatus == "START") {
                let getUserDetails = await Tournament.findOne({
                    "TournamentName": name,
                    "ParticipateList.SocketId": disSocketId
                }, {
                    "ParticipateList.$": 1,
                    "TotalRound": 1,
                    "CurrentRound": 1
                });
                let UserId = getUserDetails.ParticipateList[0].UserId;
                // let PlayerCurrentRound = getUserDetails.ParticipateList[0].PlayerCurrentRound;
                let TotalRound = getUserDetails.TotalRound;
                let CurrentRound = getUserDetails.CurrentRound;
                const updateTournament = await Tournament.findOneAndUpdate({
                    "TournamentName": name,
                    "ParticipateList.UserId": UserId,
                    "UserRoundStatus.UserId": UserId,
                    "UserRoundStatus.PlayerCurrentRound": CurrentRound
                }, {
                    $set: {
                        "ParticipateList.$.NextRoundEligibility": false,
                        "UserRoundStatus.$.PlayStatus": "LOSE",
                        "UserRoundStatus.$.NextRoundEligibility": false,
                        "UserRoundStatus.$.RoundPlayed": true
                    }
                }, { new: true });
                let participedList = updateTournament.ParticipateList;
                let getBool = participedList.filter(data => data.NextRoundEligibility).length == 0 ? true : false;
                if (getBool) {
                    await Tournament.deleteOne({ TournamentName: name });
                }
                let updateRoundDatas = updateTournament.UserRoundStatus
                let RoundList = [];
                let data = _.groupBy(updateRoundDatas, 'PlayerCurrentRound');
                for (let index = 1; index <= TotalRound; index++) {
                    const element = data[index] == undefined ? [] : data[index];
                    RoundList.push({
                        PlayerList: element
                    });
                }
                resData = {
                    status: true,
                    msg: "Lost Round Tournament",
                    RoundList: RoundList,
                    mainRoom: name,
                    TournamentName: name
                };
                _common.sendMsgToExceptUser(socket, name, "res:AnotherPlayerfinishRoundTournament", resData)
            } else {
                await Tournament.deleteOne({ TournamentName: name });
                socket.leave(name);
            }
        } else {
            console.log("Disconnect : Not Found")
        }
    });
};