const { generateAnonymousName, deleteAnonymousName } = require("../services/anonymousNames.services");
const UserModel = require('../models/user.model');


const { usersAnonymousNamesMap } = require("../services/usersAnonymousNames.services");

require("dotenv").config();


module.exports = function (io) {

    io.on("connection", (socket) => {

        console.log("new Connection: ",socket.id);

        // Initialize variables
        socket.roomId = null;
        socket.userId = null;    
        socket.currentRoom = null;

        socket.on("admin chat toggle", ({ roomType, live }) => {
            io.emit("chat status changed", {
                roomType,
                live
            });
        });
        
        // user joins room
        socket.on("join room", async ({ userId, roomId }) => {
            console.log("➡ join room:", { socketId: socket.id, userId, roomId });

            try {
                if (socket.currentRoom) {
                socket.leave(socket.currentRoom);
                }

                socket.join(roomId);
                socket.currentRoom = roomId;
                socket.userId = userId;

                const findUser = await UserModel.findById(userId);
                const existAnonymousName = findUser.anonymousName;

                
                const anonName = existAnonymousName ? existAnonymousName: generateAnonymousName();
                usersAnonymousNamesMap.set(`${roomId}:${socket.id}`, anonName);
                const userSaved = await UserModel.findByIdAndUpdate(socket.userId, { anonymousName: anonName });
                console.log('userAnonymousName', userSaved)

            } catch (err) {
                console.error("Join room error:", err);
            }
            });
            socket.on("disconnect", () => {
            console.log("socket disconnected:", socket.id);
            });

  });
};