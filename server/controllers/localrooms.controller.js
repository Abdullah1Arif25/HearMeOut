const express = require('express');
const LocalRoom = require("../models/localroom.model");
const LocalRoomRouter = express.Router();



// Create One Local Rooms
const createLocalRoom = async function(req, res, next){
    try{
        const localRoomsCount = await LocalRoom.estimatedDocumentCount();
        if(localRoomsCount>0){
            await LocalRoom.deleteMany();
        }
        const { roomId, country, liveChat } = req.body;

        if(typeof liveChat !== "boolean"){
            res.status(400).json({message: "Invalid data type for liveChat"});
        }

        ///

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required." });
        }

        if (!country || country.trim() === "") {
            return res.status(400).json({ message: "Country is required." });
        }

        if (liveChat === undefined || typeof liveChat !== "boolean") {
            return res.status(400).json({ message: "live Chat is required." });
        }

        const SingleLocalRooms = await LocalRoom.create({
            roomId,
            country,
            liveChat
        });

        return res.status(201).json({message: "success", Object: SingleLocalRooms });
    }catch(err){
        next(err);
    } 

};


// GET: Read All Local Rooms
const getLocalRoom = async function(req, res, next){
    try{
        const allRooms = await LocalRoom.find(req.body);
        res.status(200).json(allRooms);
    }catch(err){
        next(err);

    } 
};

// Update One Local Room
const updateLocalRoom = async (req, res, next) => {
  try {
    const liveChat = req.body.liveChat;

    if (liveChat !== true && liveChat !== false) {
      return res.status(400).json({ message: "liveChat must be true or false" });
    }

    const updatedRoom = await LocalRoom.findOneAndUpdate(
      { _id: req.params.roomId },
      { liveChat },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Local room not found" });
    }


    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};



// Delete One Local Rooms
const deleteLocalRoomById = async function(req, res, next){
    try{
        const deletedRoom = await LocalRoom.findOneAndDelete({roomId: req.params.roomId});
        res.status(200).json({message: "Successfully Deleted"});
    }catch(err){
        next(err)
    } 

};

module.exports = {createLocalRoom, deleteLocalRoomById, getLocalRoom, updateLocalRoom};



