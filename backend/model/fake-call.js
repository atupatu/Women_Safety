const mongoose = require('mongoose');
const { Schema } = mongoose;

const CallSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },    
});

module.exports = mongoose.model('FakeCall', CallSchema);