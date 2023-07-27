const io = require("socket.io")(8800, {
  cors: {
    origin: "https://chat-app-blush-psi.vercel.app",
  },
});



var activeUsers =[];
io.on("connection", (socket) => {
    // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (newUserId != null) {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
    }
    // send all active users to new user
    
    io.emit("get-users", activeUsers);
  });
  // send message to a specific user
  socket.on("send-message", (data) => {
    console.log("data",data)
    console.log("active",activeUsers)
    let { receiverId,senderId,text,chatId } = data;
    //let user = data?.onlineUsers?.find((user) => user.userId == receiverId);
     let user = activeUsers.find((user) => user.userId == receiverId);
    console.log("user",user)
    
    if (user) {
      io.emit("recieve-message", data);
    }
    //io.emit("recieve-message",data)
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  
});

