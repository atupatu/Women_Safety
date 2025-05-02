const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');

router.post('/sos/trigger', sosController.triggerSOS);
router.post('/sos/verify', sosController.verifyOTP);

module.exports = router;
