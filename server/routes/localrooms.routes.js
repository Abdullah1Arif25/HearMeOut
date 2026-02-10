const express = require('express');
const LocalRoom = require("../models/localroom.model");
const LocalRoomRouter = express.Router();
const localRoomController = require('../controllers/localrooms.controller');



// Create One Local Rooms
LocalRoomRouter.post("/",localRoomController.createLocalRoom );

// Read One Local Rooms
LocalRoomRouter.get("/", localRoomController.getLocalRoom);


// Update One Local Rooms
LocalRoomRouter.put("/:roomId", localRoomController.updateLocalRoom);


// Delete One Local Rooms
LocalRoomRouter.delete("/:roomId", localRoomController.deleteLocalRoomById);


module.exports = LocalRoomRouter;


