var User = require('./../../database/user.model');
const db = require("./../../connection/mongooconnection");
const booster = require('../../config/booster.config');
const perks = require('../../config/perks.config');
const Daily = require("./../../database/daily.model");
const moment = require('moment');

async function insertOne(params) {
    try {
        let resData;
        const { UserId, IsSocial } = params;
        const find = await User.findOne({ UserId: UserId });
        
        // let eventDetails = find.EventDetails; // await Daily.find({ IsSelect: true });
        // let date = moment(eventDetails[0].EndDate).format();
        // let diffrence = Math.abs(moment().diff(date, 'minutes'));
        // eventDetails = eventDetails.map(data => {
        //     let obj = {...data._doc, Minutes : diffrence };
        //     console.log(obj)
        //     return obj;
        // });
        // delete find.EventDetails;
        // console.log(eventDetails)
        if (!!find) {
            find.EventDetails = find.EventDetails.sort((a,b)=> a.UnlockValue - b.UnlockValue)
            if (!IsSocial && !(find.IsSocial)) {
                const { Password } = params;
                if (Password === find.Password) {
                    resData = {
                        "status": true,
                        "msg": "Successfully Login.",
                        "user": find,
                        
                        // {
                        //     find,
                        //     ...find.EventDetails.sort((a,b)=> a.UnlockValue - b.UnlockValue)
                        // },
                        // eventDetails
                    }
                    return resData;
                } else {
                    resData = {
                        "status": false,
                        "msg": "Please Try Again. Your Password dosen't match."
                    }
                    return resData;
                }
            } else if (find.IsSocial && IsSocial) {

                resData = {
                    "status": true,
                    "msg": "Successfully Login.",
                    "user": find
                    // "user": {
                    //     find,
                    //     ...find.EventDetails.sort((a,b)=> a.UnlockValue - b.UnlockValue)
                    // },
                    // eventDetails
                }
                return resData;
            } else {
                resData = {
                    "status": false,
                    "msg": "Please Try Again. Your credinals dosen't match."
                }
                return resData;
            }
        } else {
            let password = '';
            if (!IsSocial) {
                const { Password, Name } = params;
                if (!!Password || !!Name) {
                    if (Password.trim() === "" || Name.trim() === "") {
                        resData = {
                            "status": false,
                            "msg": "Please register first."
                        }
                        return resData;
                    } else {
                        password = Password.trim();
                    }
                } else {
                    resData = {
                        "status": false,
                        "msg": "Please register first.."
                    }
                    return resData;
                }
            }
            params.CreateDate = new Date();
            params.UpdateDate = new Date();
            params.Booster = booster;
            console.log(booster)
            params.Perks = perks;
            console.log(perks)
            params.Country = params.Country.toUpperCase();
            const getUserList = await User.findOne({}, { EventDetails: 1 });
            params.EventDetails = getUserList.EventDetails.sort((a, b) => a.UnlockValue - b.UnlockValue);
            let insertUser = new User(params);
            insertUser = await insertUser.save();
            resData = {
                "status": true,
                "msg": "Successfully Register.",
                "user": insertUser,
                // eventDetails
                // "user": {
                //     "Name": insertUser.Name,
                //     "Age": insertUser.Age,
                //     "Country": insertUser.Country,
                //     "Gender": insertUser.Gender,
                //     "Coins": insertUser.Coins,
                //     "Stars": insertUser.Stars,
                //     "Diamond": insertUser.Diamond,
                //     "IsSocial": insertUser.IsSocial,
                //     "UserId": insertUser.UserId,
                //     "Password": insertUser.password
                // }
            }
            return resData;
        }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { insertOne };


