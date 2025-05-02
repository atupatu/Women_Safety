const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmergencySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },    
});

module.exports = mongoose.model('Emergency', EmergencySchema);