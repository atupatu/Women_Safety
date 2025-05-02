let users = {}; // Stores userId -> socketId mapping
let sharingHistory = {}; // Add this at the top with other variables
const User = require('../model/user')
const History = require('../model/History');

const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // User joins their own room
        socket.on("joinRoom", (username) => {
            socket.join(username);
            console.log(`User ${username} joined room ${username}`);
        });

        socket.on("startSharing", (data) => {
            const { userName } = data;

            sharingHistory[userName] = {
                startTime: new Date().toISOString(),
                locations: [],
                isActive: true
            };
            console.log("start sharing",sharingHistory[userName]);
        });

        // Receive location updates and send them to friends' rooms
        socket.on("shareLocation", async (data) => {
            console.log(data);
            const { userName: username, latitude, longitude } = data;

            // Add location to history if sharing is active
            if (sharingHistory[username]?.isActive) {
                const placeName = await getPlaceName(latitude, longitude);
                sharingHistory[username].locations.push({
                    latitude,
                    longitude,
                    placeName,
                    timestamp: new Date().toISOString()
                });
            }

            try {
                const friends = await getFriendsFromDatabase(username);
                
                // Emit location update only to friends' rooms
                friends.forEach((friend) => {
                    io.to(friend).emit("locationUpdate", { 
                        username, 
                        latitude, 
                        longitude 
                    });
                });

                console.log(`Shared location of ${username} with friends:`, friends);
            } catch (error) {
                console.error(`Error in shareLocation for user ${username}:`, error);
            }
        });

        socket.on("stopSharing", async (data) => {
            const { userName } = data;
            console.log("Stop sharing request received from:", userName);

            if (sharingHistory[userName] && sharingHistory[userName].isActive) {
                sharingHistory[userName].isActive = false;
                sharingHistory[userName].endTime = new Date().toISOString();
                
                try {
                    // Get user from database
                    const user = await User.findOne({ name: userName });
                    if (!user) {
                        throw new Error('User not found');
                    }

                    // Create history record
                    const historyRecord = new History({
                        userId: user._id,
                        userName: userName,
                        startTime: new Date(sharingHistory[userName].startTime),
                        endTime: new Date(sharingHistory[userName].endTime),
                        locations: sharingHistory[userName].locations.map(loc => ({
                            ...loc,
                            timestamp: new Date(loc.timestamp)
                        })),
                        isActive: false
                    });

                    // Save to database
                    await historyRecord.save();
                    console.log('Location history saved to database');

                    const friends = await getFriendsFromDatabase(userName);
                    console.log(`${userName} stopped sharing with:`, friends);

                    // Send sharing ended event to each friend with the saved history
                    friends.forEach((friendUsername) => {
                        io.to(friendUsername).emit("sharingEnded", {
                            username: userName,
                            sharingDetails: sharingHistory[userName]
                        });
                    });

                    // Cleanup sharing history after sending
                    delete sharingHistory[userName];
                    
                } catch (error) {
                    console.error(`Error in stopSharing for user ${userName}:`, error);
                }
            } else {
                console.warn(`No active sharing session found for user ${userName}`);
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            const userId = Object.keys(users).find((key) => users[key] === socket.id);
            if (userId) {
                delete users[userId];
                console.log(`User ${userId} disconnected`);
            }
        });
    });

    return io;
};

// Mock function to fetch friends (Replace with DB call)
const getFriendsFromDatabase = async (username) => {
    try {
        if (!username) {
            throw new Error('Username is required');
        }

        const user = await User.findOne({ name: username })
            .populate({
                path: 'friends',
                select: 'name email phone'
            });
        
        if (!user) {
            console.warn(`User ${username} not found`);
            return [];
        }

        // If user has no friends, return empty array
        if (!user.friends) {
            return [];
        }

        // Filter out any null/undefined entries and map to names
        return user.friends
            .filter(friend => friend && friend.name)
            .map(friend => friend.name);
    } catch (error) {
        console.error(`Error fetching friends for user ${username}:`, error);
        return [];
    }
};

// Add this helper function
const getPlaceName = async (latitude, longitude) => {
    // Implement reverse geocoding here (using Google Maps or other service)
    return "Sample Location"; // Replace with actual implementation
};

module.exports = { initializeSocket };
