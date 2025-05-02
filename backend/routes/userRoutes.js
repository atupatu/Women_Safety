const express = require('express');
const { saveFakeCall , getFakeCalls , chatbotChat , addEmergency , getEmergencies , getUsers , fetchFriends, acceptRequest} = require('../controllers/UserController');
const router = express.Router();

router.post('/save/:id',saveFakeCall);
router.get('/get/:id', getFakeCalls);
router.post('/chat' , chatbotChat);
router.post('/emergency' , addEmergency);
router.get('/emergency/:id' , getEmergencies);
router.get('/user' , getUsers)
router.get('/friends/:id' , fetchFriends )
router.post('/accept_friend_request' , acceptRequest);

module.exports = router;