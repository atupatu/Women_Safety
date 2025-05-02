const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
    latitude: Number,
    longitude: Number,
    placeName: String,
    timestamp: Date
});

const HistorySchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    userName: {
        type: String,
        required: true
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date,
        required: true 
    },
    locations: [LocationSchema],
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient queries
HistorySchema.index({ userId: 1, startTime: -1 });

module.exports = mongoose.model('History', HistorySchema);
