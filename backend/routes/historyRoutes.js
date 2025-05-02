
const express = require('express');
const router = express.Router();
const History = require('../model/History');

// Get all histories for a user
router.get('/:userId', async (req, res) => {
    try {
        const histories = await History.find({ 
            userId: req.params.userId 
        })
        .sort({ startTime: -1 })
        .exec();
        
        res.json(histories);
    } catch (error) {
        console.error('Error fetching histories:', error);
        res.status(500).json({ 
            message: 'Error fetching location histories',
            error: error.message 
        });
    }
});

// Get a specific history by ID
router.get('/detail/:historyId', async (req, res) => {
    try {
        const history = await History.findById(req.params.historyId);
        if (!history) {
            return res.status(404).json({ message: 'History not found' });
        }
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ 
            message: 'Error fetching history details',
            error: error.message 
        });
    }
});

module.exports = router;
