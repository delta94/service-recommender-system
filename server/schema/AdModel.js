const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdvertisementSchema = new Schema({
    provider: { type: Schema.Types.ObjectId, ref: 'users' },
    status: String,
    banner: String,
    url: String,
    name: String,
    data_time: { type: Date, default: Date.now },
    adtype: { type: Schema.Types.ObjectId, ref: 'adtypes' },
    views: Number
});
const AdvertisementModel = mongoose.model('ads', AdvertisementSchema);

module.exports = AdvertisementModel