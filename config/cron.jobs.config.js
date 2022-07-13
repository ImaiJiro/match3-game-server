let jobSchedular = require("node-cron");
let Daily = require("./../database/daily.model")
let moment = require("moment");
const User = require("../database/user.model");
let _ = require("lodash");
let { RandomData } = require('./random.config');
// const emitEmitter = require("events")

// '59 23 23 * * *',
jobSchedular.schedule('*/01 * * * * *', async () => {
    runEveryDays();
})



/***
* 
* @description Chcek Evary Time Tournament Start and not
* 
*/
async function runEveryDays() {
    try {
        let getData = await Daily.findOne({});
        if (!!getData) {
            // console.log(getData)
            let date = moment(getData.EndDate).format();
            let CurrentData = getData.CurrentDay; /// Check Previous data value ---- DB
            let GetData = CurrentData + 1; /// Add New Value 
            if (GetData > RandomData.length) {
                GetData = 0; /// Reset Value
            }
            let diffrence = moment().diff(date, 'seconds');
            // console.log(date, diffrence)
            if (diffrence >= 0) {
                let finalData = await Daily.aggregate(
                    [{ $sample: { size: 10 } }]
                );
                // console.log(finalData.map(data => data._id))
                let getIds = finalData.map(data => data._id);
                let addDays = moment().add(10, 'minutes');
                await Daily.updateMany({}, { $set: { "EndDate": addDays, "IsSelect": false, CurrentDay: GetData } });
                // console.log(getIds)
                await Daily.updateMany({ _id: { $in: getIds } }, { $set: { "IsSelect": true, CurrentDay: GetData } });
                let getDailyData = await Daily.find({ IsSelect: true });
                let suffleData = _.shuffle(getDailyData);
                let newArray = [];
                let flag = false;
                // let a = Array.from(Array(24), (_, i) => i * 25).filter(data => data > 15);
                // let final = [...getMultipleRandom(a, 9), 590]
                let final = RandomData[GetData].toString().split(",")
                console.log(final)
                for (let index = 0; index < suffleData.length; index++) {
                    const Counter = Math.floor(Math.random() * 3) + 1;
                    const UnlockValue = parseInt(final[index])
                    newArray.push({
                        ...suffleData[index]._doc,
                        Counter,
                        UnlockValue
                    })
                    if (index == suffleData.length - 1) {
                        // console.log("----------------------------")
                        // console.log(newArray)
                        // console.log("----------------------------")
                        flag = true;
                    }
                }
                if (flag) {
                    console.log("----------------------------")
                    console.log(newArray.sort((a, b) => a.UnlockValue - b.UnlockValue))
                    console.log("----------------------------")
                    await User.updateMany({}, { $set: { EventDetails: newArray.sort((a, b) => a.UnlockValue - b.UnlockValue), Light: 0 } });
                    _common.sendMsgToAllUser(IO, "UpdateEventDetails", "res:updateEventDetails", {
                        status: true,
                        EventDetails: newArray,
                        Light: 0
                    });
                }
                // console.log(newArray)
            }
        }
    } catch (error) {
        console.log(error)
    }
}


function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}