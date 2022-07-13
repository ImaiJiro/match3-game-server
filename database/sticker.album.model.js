var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stickeralbumSchema = new Schema({
    sticker_type_id: { type: String },
    page_num : { type : Number},
    page_num : { type : Number},
    user_id : { type : String },
}, { strict: false, versionKey: false });
var StickerAlbum = mongoose.model('TBL_STICKERS', stickeralbumSchema, 'tbl_stickers');

module.exports = StickerAlbum;