var User = require('./../../database/user.model');

async function updateService(params) {
    try {
        let resData;
        const { Coins, UserId, Stars, Diamond, Trophy, Light } = params;
        const updateOnes = await User.findOneAndUpdate({ UserId: UserId }, {
            $inc: {
                "Coins": parseInt(Coins),
                "Stars": parseInt(Stars),
                "Diamond": parseInt(Diamond),
                "Trophy": parseInt(Trophy),
                "Light": parseInt(Light)
            }
        }, { new: true });
        if (!!updateOnes) {
            resData = {
                "status": true,
                "msg": "Successfully Update Data.",
                "user": updateOnes
            }
        } else {
            resData = {
                "status": false,
                "msg": "Error in Data. Please Try Again."
            }
        }
        return resData;
    } catch (error) {
        // console.log(error)
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


async function lockService(params) {
    try {
        let resData;
        let { UserId, Type, IsLock, Count, _id } = params;
        let updateOnes;
        if (Type.toUpperCase() === "BOOSTER") {
            let getUser = await User.findOne({ UserId: UserId, "Booster._id": _id }, { "Booster.$": 1 });
            let countUser = getUser.Booster[0].counter + Count
            console.log(countUser)
            // if(!!getUser.Booster[0].counter) {
            //     countUser = getUser.Booster[0].counter - Count
            // }
            if (countUser < 0) {
                Count = 0
            }
            updateOnes = await User.findOneAndUpdate({ UserId: UserId, "Booster._id": _id }, {
                $inc: {
                    "Booster.$.counter": parseInt(Count)
                },
                $set: {
                    "Booster.$.islock": Boolean(IsLock)
                }
            }, { new: true });
        } else {
            let getUser = await User.findOne({ UserId: UserId, "Perks._id": _id }, { "Perks.$": 1 });
            let countUser = getUser.Perks[0].counter + Count;
            console.log(countUser)
            console.log(countUser < 0)
            if (countUser < 0) {
                Count = 0
            }
            console.log(Count)
            updateOnes = await User.findOneAndUpdate({ UserId: UserId, "Perks._id": _id }, {
                $inc: {
                    "Perks.$.counter": parseInt(Count)
                },
                $set: {
                    "Perks.$.islock": Boolean(IsLock)
                }
            }, { new: true });
        }
        if (!!updateOnes) {
            resData = {
                "status": true,
                "msg": "Successfully Update Data.",
                "user": updateOnes
            }
        } else {
            resData = {
                "status": false,
                "msg": "Error in Data. Please Try Again."
            }
        }
        return resData;
    } catch (error) {
        console.log(error)
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


async function counterService(params) {
    try {
        let resData;
        const { Coins, UserId, Stars, Diamond, Trophy } = params;
        const updateOnes = await User.findOneAndUpdate({ UserId: UserId }, {
            $inc: {
                "Coins": parseInt(Coins),
                "Stars": parseInt(Stars),
                "Diamond": parseInt(Diamond),
                "Trophy": parseInt(Trophy)
            }
        }, { new: true });
        if (updateOnes !== undefined) {
            resData = {
                "status": true,
                "msg": "Successfully Update Data.",
                "user": updateOnes
            }
        } else {
            resData = {
                "status": false,
                "msg": "Error in Data. Please Try Again."
            }
        }
        return resData;
    } catch (error) {
        // console.log(error)
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

module.exports = { updateService, lockService, counterService };


