const FriendRequest = require('../../model/friend-request');
const User = require('../../model/user');

const initializzeSocket = (io) => {
    io.on('connection', (socket) => {
        // Send friend request
        socket.on('send_friend_request', async ({ senderName, receiverName }) => {
            try {
                const newRequest = await FriendRequest.create({
                    sender: senderName,
                    receiver: receiverName,
                    status: 'pending'
                });
                
                io.to(receiverName).emit('new_friend_request', newRequest);
            } catch (error) {
                console.error('Friend request error:', error);
            }
        });

        // Get pending requests
        socket.on('get_pending_requests', async ({ userName }) => {
            try {
                const pendingRequests = await FriendRequest.find({
                    receiver: userName,
                    status: 'pending'
                }).populate('sender', 'name email');
                
                socket.emit('pending_requests', pendingRequests);
            } catch (error) {
                console.error('Get pending requests error:', error);
            }
        });
        socket.on('accept_friend_request', async ({ requestId }) => {
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
        })
    });

};

module.exports = {initializzeSocket};