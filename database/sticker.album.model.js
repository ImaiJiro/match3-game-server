var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stickeralbumSchema = new Schema({
    page_num : { type : Number},
    page_num : { type : Number},
    user_id : { type : String },
    sticker_type_number: { type: Number},
}, { strict: false, versionKey: false });
var StickerAlbum = mongoose.model('TBL_STICKERS', stickeralbumSchema, 'tbl_stickers');

module.exports = StickerAlbum;