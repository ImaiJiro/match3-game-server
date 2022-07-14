var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stickertypeSchema = new Schema({
    sticker_name: { type: String },
    price : { type : Number},
    pack_type : { type : String },
    sticker_number : { type : Number},
}, { strict: false, versionKey: false });
var StickerType = mongoose.model('TBL_STICKER_TYPE', stickertypeSchema, 'tbl_sticker_type');

module.exports = StickerType;
