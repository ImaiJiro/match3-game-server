const Hashids = require('hashids/cjs');
const { v4: uuidv4 } = require('uuid');


/// Unique Tournament Room
async function uniqueTournamentName(value) {
    try {
        var stringHash = uuidv4() + value + new Date();
        const hashids = new Hashids(stringHash, 6, '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        var createHash = hashids.encode(1, 2, 3);
        return {
            status: true,
            createMasterRoom: createHash
        };
    } catch (error) {
        //console.log(error);
        return {
            status: false,
            msg: "Create Room Error."
        };
    }
}



/// Unique Room Ids
async function uniqueRoundName(value) {
    try {
        var stringHash = uuidv4() + value + new Date();
        const hashids = new Hashids(stringHash, 6, '1234567890abcdefghijklmnopqrstuvwxyz');
        var createHash = hashids.encode(1, 2, 3);
        return {
            status: true,
            createChildRoom: createHash
        };
    } catch (error) {
        //console.log(error);
        return {
            status: false,
            msg: "Create Room Error."
        };
    }
}

module.exports = { uniqueTournamentName, uniqueRoundName };