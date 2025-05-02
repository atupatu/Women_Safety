const Emergency = require('../model/Emergency');
const FakeCall = require('../model/fake-call');
const User = require('../model/user');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FriendRequest = require('../model/friend-request');

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key or load from environment variables
const genAI = new GoogleGenerativeAI(API_KEY);

const saveFakeCall = async (req, res) => {
    const { phone, name } = req.body;
    const userId = req.params.id;
    const fakeCall = new FakeCall({ phone, name, userId });
    try {
        await fakeCall.save();
        res.status(201).json({ message: 'Fake call saved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFakeCalls = async (req, res) => {
    try {
        const userId = req.params.id; // Fixed: correctly get userId from params
        const fakeCalls = await FakeCall.find({ userId: userId }); // Added userId in query
        res.json(fakeCalls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const chatbotChat = async (req, res) => {
    const { message } = req.body;
    
    try {
        // Get the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        // Setup the chat context
        const chatContext = `You are a helpful assistant for a safety app called "I'M SAFE". 
        Your primary goal is to provide safety advice, emergency guidance, and general help 
        to users who might be in uncomfortable or dangerous situations. Keep responses brief, 
        helpful, and compassionate. If someone is in immediate danger, always advise them to 
        call emergency services (911 or local equivalent) immediately.`;
        
        // Generate a response from Gemini
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "What's your purpose?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "I'm your safety assistant in the I'M SAFE app. I can provide safety advice, emergency guidance, and help in uncomfortable situations. How can I assist you today?" }],
                }
            ],
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
            },
        });
        
        const result = await chat.sendMessage(message);
        const response = result.response.text();
        
        res.json({ response });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ 
            response: "I'm sorry, I'm having trouble processing your request right now. If you're in danger, please contact emergency services immediately." 
        });
    }
};

const addEmergency = async(req, res) => {
    const { userId, phone } = req.body;  // Changed from emergrncy to phone
    const call = new Emergency({ userId, phone });
    try {
        await call.save();
        res.status(201).json({ message: 'Emergency contact saved' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const getEmergencies = async(req, res) => {
    try {
        const userId = req.params.id; // Changed from req.params.userId
        const emergencyContacts = await Emergency.find({ userId });
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the data in the format expected by frontend
        res.json(emergencyContacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        // Get friend requests involving current us
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const fetchFriends = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('friends', 'name email phone');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user.friends);
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        
        // Find the friend request
        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        request.status = "accepted";

        // Find sender and receiver
        const user1 = await User.findOne({ name: request.sender });
        const user2 = await User.findOne({ name: request.receiver });
        console.log(user1);
        console.log(user2);

        if (!user1 || !user2) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure ObjectIds are added correctly and avoid duplicates
        if (!user1.friends.includes(user2._id)) {
            user1.friends.push(user2._id);
        }
        if (!user2.friends.includes(user1._id)) {
            user2.friends.push(user1._id);
        }

        // Save both users
        await Promise.all([user1.save(), user2.save(), request.save()]);

        // Return updated friends list with populated details
        const updatedUser1 = await User.findById(user1._id).populate('friends', 'name email phone');
        const updatedUser2 = await User.findById(user2._id).populate('friends', 'name email phone');

        res.json({
            message: "Friend Request Accepted",
            user1Friends: updatedUser1.friends, // List of populated friends for sender
            user2Friends: updatedUser2.friends  // List of populated friends for receiver
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to accept friend request" });
    }
};


module.exports = { 
    saveFakeCall, 
    getFakeCalls, 
    chatbotChat, 
    addEmergency, 
    getEmergencies, 
    getUsers, 
    fetchFriends,
    acceptRequest
};