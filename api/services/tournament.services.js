var _ = require("lodash");
var User = require('./../../database/user.model');
var Tournament = require('./../../database/tournament.model');
const { uniqueRoundName, uniqueTournamentName } = require("./../../common/tournament.unique");

async function insertOne(socket, params) {
    try {
        const { UserId, Country, ProfilePicUrl, SocketId, Name, Gender, IsSocial } = params;
        console.log("Request ", params)
        const getPendingTournament = await Tournament.findOne({ TournamentStatus: "PENDING" });
        if (getPendingTournament != null) {
            console.log(getPendingTournament.ParticipateList.length)
            console.log(parseInt(process.env.TOTAL_PLAYER))
            console.log(getPendingTournament.ParticipateList.length < parseInt(process.env.TOTAL_PLAYER) - 1)
            let GetTotalRound = (Math.log(parseInt(process.env.TOTAL_PLAYER)) / Math.log(2)) - 1;
            if (getPendingTournament.ParticipateList.length < parseInt(process.env.TOTAL_PLAYER) - 1) {
                ///
                /// Less Than 8 Player
                ///
                const updateTournament = await Tournament.findOneAndUpdate(
                    { TournamentName: getPendingTournament.TournamentName },
                    {
                        $addToSet: {
                            ParticipateList: {
                                UserId: UserId,
                                Country: Country,
                                ProfilePicUrl: ProfilePicUrl,
                                SocketId: SocketId,
                                Name: Name,
                                Gender: Gender,  
                                IsSocial: IsSocial
                            }
                        }
                    },
                    { new: true }
                );
                socket.join(getPendingTournament.TournamentName);
                var RoundList = [];
                RoundList.push({
                    "PlayerList": updateTournament.ParticipateList
                });
                for (let index = 0; index < GetTotalRound; index++) {
                    RoundList.push({
                        "PlayerList": []
                    });
                }
                resData = {
                    status: true,
                    msg: "Joint Tournament",
                    RoundList: RoundList,
                    mainRoom: updateTournament.TournamentName,
                    TournamentName: updateTournament.TournamentName
                };
                _common.sendMsgToUser(socket, "res:jointTournament", resData);
                _common.sendMsgToExceptUser(socket, getPendingTournament.TournamentName, "res:anotherUserJointTournament",
                    {
                        status: true,
                        code: 0,
                        mainRoom: updateTournament.TournamentName,
                        TournamentName: updateTournament.TournamentName,
                        RoundList: RoundList
                    });
            } else if (getPendingTournament.ParticipateList.length + 1 == parseInt(process.env.TOTAL_PLAYER)) {
                console.log("--------------------------------------------")
                console.log("-------------Start Tournament------------------")
                console.log("--------------------------------------------")
                ///
                /// Equal 8 Player
                ///
                const updateTournament = await Tournament.findOneAndUpdate(
                    { TournamentName: getPendingTournament.TournamentName },
                    {
                        $addToSet: {
                            ParticipateList: {
                                UserId: UserId,
                                Country: Country,
                                ProfilePicUrl: ProfilePicUrl,
                                SocketId: SocketId,
                                Name: Name,
                                Gender: Gender,  
                                IsSocial: IsSocial
                            }
                        },
                        $set: {
                            TournamentStatus: "START"
                        },
                        $inc: {
                            CurrentRound: parseInt(1)
                        }
                    },
                    { new: true }
                );
                console.log(updateTournament)
                console.log("--------------------------------------------")
                console.log("-------------Start Tournament------------------")
                console.log("--------------------------------------------")

                var RoundList = [];
                RoundList.push({
                    "PlayerList": updateTournament.ParticipateList
                });
                await Tournament.findOneAndUpdate(
                    { TournamentName: getPendingTournament.TournamentName },
                    { $set: { UserRoundStatus: updateTournament.ParticipateList } });
                for (let index = 0; index < GetTotalRound; index++) {
                    RoundList.push({
                        "PlayerList": []
                    });
                }

                resData = {
                    status: true,
                    msg: "Start Tournament",
                    RoundList: RoundList,
                    mainRoom: updateTournament.TournamentName,
                    TournamentName: updateTournament.TournamentName
                };
                socket.join(getPendingTournament.TournamentName);
                _common.sendMsgToUser(socket, "res:jointTournament", resData);
                _common.sendMsgToExceptUser(socket, getPendingTournament.TournamentName, "res:anotherUserJointTournament",
                    {
                        status: true,
                        code: 1,
                        mainRoom: updateTournament.TournamentName,
                        TournamentName: updateTournament.TournamentName,
                        RoundList: RoundList
                    });
                const chunk = (arr, size = 2) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);
                let createRooms = chunk(updateTournament.ParticipateList);
                // console.log(createRooms)
                for (let i = 0; i < createRooms.length; i++) {
                    let createRoom = createRooms[i][0].UserId + createRooms[i][1].UserId;
                    let firstUserSocketId = createRooms[i][0].SocketId;
                    let secondUserSocketId = createRooms[i][1].SocketId;
                    let createRoomUnique = await uniqueRoundName(createRoom);
                    let updateFirst = await Tournament.findOneAndUpdate(
                        { "ParticipateList.UserId": createRooms[i][0].UserId, TournamentName: getPendingTournament.TournamentName },
                        {
                            $set: { "ParticipateList.$.RoomName": createRoomUnique.createChildRoom },
                            // $inc: { "ParticipateList.$.PlayerCurrentRound": parseInt(1) }
                        }, { new: true, fields: { "ParticipateList": 1, _id: 0 } });
                    let updateSecond = await Tournament.findOneAndUpdate(
                        { "ParticipateList.UserId": createRooms[i][1].UserId, TournamentName: getPendingTournament.TournamentName },
                        {
                            $set: { "ParticipateList.$.RoomName": createRoomUnique.createChildRoom },
                            // $inc: { "ParticipateList.$.PlayerCurrentRound": parseInt(1) }
                        }, { new: true, fields: { "ParticipateList": 1, _id: 0 } });
                    updateFirst = updateFirst.ParticipateList;
                    console.log("First ", updateFirst.filter(data => data.UserId == createRooms[i][0].UserId)[0])
                    updateSecond = updateSecond.ParticipateList;
                    console.log("Second ", updateSecond.filter(data => data.UserId == createRooms[i][0].UserId)[0])
                    IO.to(firstUserSocketId).emit("res:startTournament", {
                        status: true,
                        childRoom: {
                            roomName: createRoomUnique.createChildRoom,
                            ParticipateUser: updateFirst.filter(data => data.UserId == createRooms[i][0].UserId)[0]
                        }
                    });
                    IO.to(secondUserSocketId).emit("res:startTournament", {
                        status: true,
                        childRoom: {
                            roomName: createRoomUnique.createChildRoom,
                            ParticipateUser: updateFirst.filter(data => data.UserId == createRooms[i][1].UserId)[0]
                        }
                    });
                }
                // let allTournament = await Tournament.findOne(
                //     { TournamentStatus: getPendingTournament.TournamentName },
                //     { ParticipateList: 1, _id: 0 });
                // IO.in(updateTournament.TournamentName).emit("res:startTournament", {
                //     status: true,
                //     readyTournament: allTournament.ParticipateList
                // });
            } else {
                ///
                /// Note : No Any Player
                ///
                console.log("--------------------------------------------")
                console.log("-------------No Any Player------------------")
                console.log("--------------------------------------------")
                const uniqueTournamentNames = await uniqueTournamentName(UserId)
                var array = [];
                array.push({
                    UserId: UserId,
                    Country: Country,
                    ProfilePicUrl: ProfilePicUrl,
                    SocketId: SocketId,
                    Name: Name,
                    Gender: Gender,  
                    IsSocial: IsSocial
                });
                let TotalRound = Math.log(parseInt(process.env.TOTAL_PLAYER)) / Math.log(2)
                let insertOne = new Tournament({
                    TournamentName: uniqueTournamentNames.createMasterRoom,
                    ParticipateList: array,
                    TournamentStatus: "PENDING",
                    TotalRound: TotalRound,
                    CreateDate: new Date(),
                    UpdateDate: new Date()
                });
                insertOne = await insertOne.save();
                if (insertOne != undefined) {
                    socket.join(insertOne.TournamentName)
                    var RoundList = [];
                    RoundList.push({
                        "PlayerList": insertOne.ParticipateList
                    });
                    for (let index = 0; index < TotalRound - 1; index++) {
                        RoundList.push({
                            "PlayerList": []
                        });
                    }
                    resData = {
                        status: true,
                        msg: "Create Tournament",
                        RoundList: RoundList,
                        mainRoom: insertOne.TournamentName,
                        TournamentName: insertOne.TournamentName
                    };
                    _common.sendMsgToUser(socket, "res:jointTournament", resData);
                } else {
                    return {
                        status: false,
                        msg: "Error on Tournament Create."
                    };
                }
            }
        } else {
            ///
            /// Note : No Any Tournament
            ///
            console.log("--------------------------------------------")
            console.log("-------------No Any Tournament--------------")
            console.log("--------------------------------------------")
            const uniqueTournamentNames = await uniqueTournamentName(UserId);
            let TotalRound = Math.log(parseInt(process.env.TOTAL_PLAYER)) / Math.log(2)
            var array = [];
            array.push({
                UserId: UserId,
                Country: Country,
                ProfilePicUrl: ProfilePicUrl,
                SocketId: SocketId,
                Name: Name,
                Gender: Gender,  
                IsSocial: IsSocial
            });
            let insertOne = new Tournament({
                TournamentName: uniqueTournamentNames.createMasterRoom,
                ParticipateList: array,
                TournamentStatus: "PENDING",
                TotalRound: TotalRound,
                CreateDate: new Date(),
                UpdateDate: new Date()
            })
            insertOne = await insertOne.save();
            if (insertOne != undefined) {
                socket.join(insertOne.TournamentName)
                var RoundList = [];
                RoundList.push({
                    "PlayerList": insertOne.ParticipateList
                });
                for (let index = 0; index < TotalRound - 1; index++) {
                    RoundList.push({
                        "PlayerList": []
                    });
                }
                resData = {
                    status: true,
                    msg: "Create Tournament",
                    RoundList: RoundList,
                    mainRoom: insertOne.TournamentName,
                    TournamentName: insertOne.TournamentName
                };
                _common.sendMsgToUser(socket, "res:jointTournament", resData);
            } else {
                return {
                    status: false,
                    msg: "Error on Tournament Create."
                };
            }
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


async function leaveOneServices(socket, params) {
    try {
        let resData;
        const { UserId, SocketId, TournamentName, IsTournamentExit } = params;
        const getTournament = await Tournament.findOne({ "ParticipateList.UserId": UserId, TournamentName: TournamentName });
        console.log("--------------------------------------------")
        console.log("-------------Leave Tournament--------------")
        console.log("--------------------------------------------")
        let GetTotalRound = (Math.log(parseInt(process.env.TOTAL_PLAYER)) / Math.log(2)) - 1;
        if (!!getTournament) {
            if (getTournament.TournamentStatus == "PENDING") {
                if (getTournament.ParticipateList.length > 1) {
                    let updateTournament = await Tournament.findOneAndUpdate({ TournamentName: TournamentName }, {
                        $pull: {
                            "ParticipateList": { "UserId": UserId }
                        }
                    }, { new: true });
                    var RoundList = [];
                    RoundList.push({
                        "PlayerList": updateTournament.ParticipateList
                    });
                    for (let index = 0; index < GetTotalRound; index++) {
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
                    _common.sendMsgToExceptUser(socket, TournamentName, "res:leaveTournamentAnotherPlayer", resData);
                    _common.sendMsgToUser(socket, "res:leaveTournament", resData);
                } else {
                    let deleteTournament = await Tournament.findOneAndDelete({ TournamentName: TournamentName });
                    var RoundList = [];
                    RoundList.push({
                        "PlayerList": deleteTournament.ParticipateList
                    });
                    for (let index = 0; index < GetTotalRound; index++) {
                        RoundList.push({
                            "PlayerList": []
                        });
                    }
                    _common.sendMsgToUser(socket, "res:leaveTournament", {
                        status: true,
                        leaveUser: RoundList
                    });
                }
                socket.leave(TournamentName);
            } else if (getTournament.TournamentStatus === "START") {
                const { Points, CurrentRound } = params;
                let participedLists = getTournament.ParticipateList;
                participedLists = participedLists.filter(data => data.UserId == UserId)[0]
                await Tournament.findOneAndUpdate({
                    "TournamentName": TournamentName,
                    "ParticipateList.UserId": UserId,
                    "UserRoundStatus.UserId": UserId,
                    "UserRoundStatus.PlayerCurrentRound": CurrentRound,
                }, {
                    $set: {
                        "ParticipateList.$.NextRoundEligibility": false,
                        "UserRoundStatus.$.Points": Points,
                        "UserRoundStatus.$.PlayStatus": "QUIT",
                        "UserRoundStatus.$.NextRoundEligibility": false,
                        "UserRoundStatus.$.RoundPlayed": true
                    }
                }, { new: true });
                let updateTournament = await Tournament.findOne({
                    "TournamentName": TournamentName
                });
                let participedList = updateTournament.ParticipateList;
                let updateRoundTournamentData = updateTournament.UserRoundStatus;
                let getBool = participedList.filter(data => data.NextRoundEligibility).length == 0 ? true : false;
                if (getBool) {
                    await Tournament.deleteOne({ TournamentName: TournamentName });
                }
                let RoundList = [];
                let data = _.groupBy(updateRoundTournamentData, 'PlayerCurrentRound');
                for (let index = 1; index <= updateTournament.TotalRound; index++) {
                    const element = data[index] == undefined ? [] : data[index];
                    RoundList.push({
                        PlayerList: element
                    });
                }
                resData = {
                    status: true,
                    msg: "Lost Round Tournament",
                    RoundList: RoundList,
                    mainRoom: updateTournament.TournamentName,
                    TournamentName: updateTournament.TournamentName,
                    IsTournamentExit
                };
                _common.sendMsgToUser(socket, "res:finishRoundTournament", resData);
                console.log("****Lost User****" + resData + "****Finish****");
            } else {
                await Tournament.findOneAndDelete({ TournamentName: TournamentName });
                resData = {
                    status: false,
                    msg: "This is complete tournament."
                };
                socket.leave(TournamentName);
                _common.sendMsgToUser(socket, "res:leaveTournament", resData);
            }
        } else {
            resData = {
                status: false,
                msg: "This is not participed any room."
            };
            socket.leave(TournamentName);
            _common.sendMsgToUser(socket, "res:leaveTournament", resData);
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Response Type => res:winRoundTournament (CurrentRound is not Last) 
async function winTournamentServices(socket, params) {
    try {
        let resData;
        const { UserId, SocketId, TournamentName, Points, PlayStatus, CurrentRound } = params;
        const getTournament = await Tournament.findOne({ "TournamentName": TournamentName });
        console.log("--------------------------------------------")
        console.log("-------------Win Tournament--------------")
        console.log("--------------------------------------------")
        console.log("Player Request ", params);
        if (!!getTournament) {
            let getAllUser = getTournament.ParticipateList;
            let getUser = getAllUser.filter(data => data.UserId === UserId)[0];
            console.log("Get User ", params);
            if (getTournament.TotalRound == getTournament.CurrentRound) {
                const { Trophy } = params;
                const updateTournamentData = await Tournament.findOneAndUpdate({
                    "TournamentName": TournamentName,
                    "ParticipateList.UserId": UserId,
                    "UserRoundStatus.UserId": UserId,
                    "UserRoundStatus.PlayerCurrentRound": getTournament.TotalRound
                }, {
                    $set: {
                        "TournamentStatus": "COMPLETE",
                        "ParticipateList.$.NextRoundEligibility": false,
                        "UserRoundStatus.$.Points": Points,
                        "UserRoundStatus.$.PlayStatus": PlayStatus,
                        "UserRoundStatus.$.RoundPlayed": true
                    },
                    $inc: {
                        "Trophy": Trophy
                    }
                }, { new: true });
                let RoundList = [];
                let data = _.groupBy(updateTournamentData.UserRoundStatus, 'PlayerCurrentRound');
                for (let index = 1; index <= getTournament.TotalRound; index++) {
                    const element = data[index];
                    RoundList.push({
                        PlayerList: element
                    });
                }
                resData = {
                    status: true,
                    msg: "Win Tournament",
                    RoundList: RoundList,
                    mainRoom: updateTournamentData.TournamentName,
                    TournamentName: updateTournamentData.TournamentName,
                    IsTournamentExit: false
                };
                if (PlayStatus.toUpperCase() == "WIN") {
                    _common.sendMsgToUser(socket, "res:winTournament", resData);
                } else {
                    _common.sendMsgToUser(socket, "res:finishRoundTournament", resData);
                    _common.sendMsgToExceptUser(socket, TournamentName, "res:AnotherPlayerfinishRoundTournament", resData);
                }
            } else {
                let totalRounds = getTournament.TotalRound;
                let currentRound = getTournament.CurrentRound;
                let nextRoundPlayer = Math.pow(2, totalRounds - currentRound);
                if (PlayStatus.toUpperCase() == "WIN") {
                    await Tournament.findOneAndUpdate({
                        "TournamentName": TournamentName,
                        "ParticipateList.UserId": UserId,
                        "UserRoundStatus.UserId": UserId,
                        "UserRoundStatus.PlayerCurrentRound": CurrentRound
                    }, {
                        $set: {
                            "ParticipateList.$.NextRoundEligibility": true,
                            "UserRoundStatus.$.NextRoundEligibility": false,
                            "UserRoundStatus.$.Points": Points,
                            "UserRoundStatus.$.PlayStatus": "WIN",
                            "UserRoundStatus.$.RoundPlayed": true
                        },
                        $addToSet: {
                            "winUserId": UserId
                        }
                    }, { new: true });
                    const updateTournamentData = await Tournament.findOneAndUpdate({
                        "TournamentName": TournamentName,
                        "ParticipateList.UserId": UserId
                    }, {
                        $push: {
                            "UserRoundStatus": {
                                UserId: UserId,
                                Country: getUser.Country,
                                ProfilePicUrl: getUser.ProfilePicUrl,
                                Name: getUser.Name,
                                Gender: getUser.Gender,  
                                IsSocial: getUser.IsSocial,
                                SocketId: SocketId,
                                PlayerCurrentRound: parseInt(CurrentRound) + 1,
                                PlayRounds: parseInt(CurrentRound) + 1,
                                NextRoundEligibility: true
                            }
                        }
                    }, { new: true });
                    let countNextRoundPlayer = updateTournamentData.winUserId.length;
                    let updateRoundTournamentData = updateTournamentData.UserRoundStatus;
                    let RoundList = [];
                    let data = _.groupBy(updateRoundTournamentData, 'PlayerCurrentRound');
                    for (let index = 1; index <= updateTournamentData.TotalRound; index++) {
                        const element = data[index] == undefined ? [] : data[index];
                        RoundList.push({
                            PlayerList: element
                        });
                    }
                    resData = {
                        status: true,
                        msg: "Win Round Tournament",
                        RoundList: RoundList,
                        mainRoom: updateTournamentData.TournamentName,
                        TournamentName: updateTournamentData.TournamentName,
                        IsTournamentExit: false
                    };
                    // console.log("****20****" + JSON.stringify(resData) + "****30****");

                    _common.sendMsgToUser(socket, "res:finishRoundTournament", resData);
                    _common.sendMsgToExceptUser(socket, TournamentName, "res:AnotherPlayerfinishRoundTournament", resData);
                    if (nextRoundPlayer == countNextRoundPlayer) {
                        setTimeout(async function timeFun() {
                            console.log(nextRoundPlayer, ":====:", countNextRoundPlayer)
                            let updateTournamentRoundData = await Tournament.findOneAndUpdate({ "TournamentName": TournamentName }, {
                                $set: {
                                    "winUserId": []
                                }
                            }, { new: true });
                            let winUserList = updateTournamentRoundData.UserRoundStatus;
                            let data = _.groupBy(winUserList, 'PlayerCurrentRound');
                            let winUserListData;
                            for (let index = 1; index <= getTournament.TotalRound; index++) {
                                if (index == updateTournamentRoundData.CurrentRound + 1) {
                                    winUserListData = data[index];
                                }
                            }
                            console.log(winUserListData)
                            // console.log("All user list", winUserList)
                            // winUserList = winUserList.filter(data => data.NextRoundEligibility == true);
                            // console.log("Win Filter user list", winUserList)
                            const chunk = (arr, size = 2) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);
                            let createRooms = chunk(winUserListData);
                            console.log("New Create Room ", createRooms)
                            for (let i = 0; i < createRooms.length; i++) {
                                let createRoom = createRooms[i][0].UserId + createRooms[i][1].UserId;
                                let firstUserSocketId = createRooms[i][0].SocketId;
                                let secondUserSocketId = createRooms[i][1].SocketId;
                                let createRoomUnique = await uniqueRoundName(createRoom);
                                let updateFirst = await Tournament.findOneAndUpdate(
                                    { "ParticipateList.UserId": createRooms[i][0].UserId, TournamentName: TournamentName },
                                    {
                                        $set: { "ParticipateList.$.RoomName": createRoomUnique.createChildRoom, "CurrentRound": CurrentRound + 1 },
                                        $inc: { "ParticipateList.$.PlayerCurrentRound": parseInt(1) }
                                    }, { new: true, fields: { "ParticipateList": 1, _id: 0 } });
                                let updateSecond = await Tournament.findOneAndUpdate(
                                    { "ParticipateList.UserId": createRooms[i][1].UserId, TournamentName: TournamentName },
                                    {
                                        $set: { "ParticipateList.$.RoomName": createRoomUnique.createChildRoom, "CurrentRound": CurrentRound + 1 },
                                        $inc: { "ParticipateList.$.PlayerCurrentRound": parseInt(1) }
                                    }, { new: true, fields: { "ParticipateList": 1, _id: 0 } });
                                updateFirst = updateFirst.ParticipateList;
                                // console.log("First Round User ", updateFirst.filter(data => data.UserId == createRooms[i][0].UserId)[0])
                                updateSecond = updateSecond.ParticipateList;
                                // console.log("Second Round User ", updateSecond.filter(data => data.UserId == createRooms[i][0].UserId)[0])
                                IO.to(firstUserSocketId).emit("res:startTournament", {
                                    status: true,
                                    childRoom: {
                                        roomName: createRoomUnique.createChildRoom,
                                        ParticipateUser: updateFirst.filter(data => data.UserId == createRooms[i][0].UserId)[0]
                                    }
                                });
                                IO.to(secondUserSocketId).emit("res:startTournament", {
                                    status: true,
                                    childRoom: {
                                        roomName: createRoomUnique.createChildRoom,
                                        ParticipateUser: updateSecond.filter(data => data.UserId == createRooms[i][1].UserId)[0]
                                    }
                                });
                            }
                        }, 5000)
                    }
                } else {
                    const updateTournamentData = await Tournament.findOneAndUpdate({
                        "TournamentName": TournamentName,
                        "ParticipateList.UserId": UserId,
                        "UserRoundStatus.UserId": UserId,
                        "UserRoundStatus.PlayerCurrentRound": CurrentRound
                    }, {
                        $set: {
                            "ParticipateList.$.NextRoundEligibility": false,
                            "UserRoundStatus.$.Points": Points,
                            "UserRoundStatus.$.PlayStatus": "LOSE",
                            "UserRoundStatus.$.NextRoundEligibility": false,
                            "UserRoundStatus.$.RoundPlayed": true
                        }
                    }, { new: true });
                    let updateRoundDatas = updateTournamentData.UserRoundStatus
                    let RoundList = [];
                    let data = _.groupBy(updateRoundDatas, 'PlayerCurrentRound');
                    for (let index = 1; index <= getTournament.TotalRound; index++) {
                        const element = data[index] == undefined ? [] : data[index];
                        RoundList.push({
                            PlayerList: element
                        });
                    }
                    resData = {
                        status: true,
                        msg: "Lost Round Tournament",
                        RoundList: RoundList,
                        mainRoom: updateTournamentData.TournamentName,
                        TournamentName: updateTournamentData.TournamentName,
                        IsTournamentExit: false
                    };
                    _common.sendMsgToUser(socket, "res:finishRoundTournament", resData);
                    // console.log("****Lost User****" + JSON.stringify(resData) + "****Finish****");
                    // _common.sendMsgToAllUser(IO, TournamentName, "res:AnotherPlayerfinishRoundTournament", resData);
                    _common.sendMsgToExceptUser(socket, TournamentName, "res:AnotherPlayerfinishRoundTournament", resData);
                    // socket.leave(TournamentName);
                }
            }
        } else {
            _common.sendMsgToUser(socket, "res:finishRoundTournament", { status: false, msg: "Not Found Tournament." });
        }

    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


module.exports = { insertOne, leaveOneServices, winTournamentServices };


 // let countNextRoundPlayer = updateTournamentData.winUserId.length;
                    // if (nextRoundPlayer == countNextRoundPlayer) {
                    //     await Tournament.updateOne({ "TournamentName": TournamentName }, {
                    //         $set: {
                    //             "winUserId": []
                    //         }
                    //     }, { new: true });

                    //     let winUserList = updateTournamentData.ParticipateList;

                    //     winUserList = winUserList.map(data => data.NextRoundEligibility == true);

                    //     const chunk = (arr, size = 2) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);
                    //     let createRooms = chunk(winUserList);
                    //     console.log(createRooms)
                    //     for (let i = 0; i < createRooms.length; i++) {
                    //         let createRoom = createRooms[i][0].UserId + createRooms[i][1].UserId;
                    //         let firstUserSocketId = createRooms[i][0].SocketId;
                    //         let secondUserSocketId = createRooms[i][1].SocketId;
                    //         let createRoomUnique = await uniqueRoundName(createRoom);
                    //         let updateFirst = await Tournament.findOneAndUpdate(
                    //             { "ParticipateList.UserId": createRooms[i][0].UserId, TournamentName: TournamentName },
                    //             {
                    //                 $set: { "ParticipateList.$.RoomName": createRoomUnique.createChildRoom },
                    //                 $inc: { "ParticipateList.$.PlayerCurrentRound": parseInt(1) }
                    //             }, { new: true, fields: { "ParticipateList": 1, _id: 0 } });
                    //         let updateSecond = await Tournament.findOneAndUpdate(
                    //             { "ParticipateList.UserId": createRooms[i][1].UserId, TournamentName: TournamentName },
                    //             {
                    //                 $set: { "ParticipateList.$.RoomName": createRoomUnique.createChildRoom },
                    //                 $inc: { "ParticipateList.$.PlayerCurrentRound": parseInt(1) }
                    //             }, { new: true, fields: { "ParticipateList": 1, _id: 0 } });
                    //         updateFirst = updateFirst.ParticipateList;
                    //         // console.log("Datat ", updateFirst.filter(data => data.UserId == createRooms[i][0].UserId)[0])
                    //         updateSecond = updateSecond.ParticipateList;
                    //         // console.log(updateSecond)
                    //         IO.to(firstUserSocketId).emit("res:startTournament", {
                    //             status: true,
                    //             childRoom: {
                    //                 roomName: createRoomUnique.createChildRoom,
                    //                 ParticipateUser: updateFirst.filter(data => data.UserId == createRooms[i][0].UserId)[0]
                    //             }
                    //         });
                    //         IO.to(secondUserSocketId).emit("res:startTournament", {
                    //             status: true,
                    //             childRoom: {
                    //                 roomName: createRoomUnique.createChildRoom,
                    //                 ParticipateUser: updateFirst.filter(data => data.UserId == createRooms[i][1].UserId)[0]
                    //             }
                    //         });
                    //     }
                    // }
                    // let updateRoundTournamentData = updateTournamentData.UserRoundStatus;
                    // let listWinBroadCast = updateRoundTournamentData.map(data => data.CurrentRound == CurrentRound && data.PlayStatus == "WIN");
                    // let listLoseBroadCast = updateRoundTournamentData.filter(data => data.CurrentRound == CurrentRound && data.PlayStatus == "LOSE");