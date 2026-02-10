const GlobalRoom = require('../models/globalroom.model');
const { rawListeners } = require('../models/localroom.model');

// Create global room
const createGlobalRoom = async function (req, res, next) {
  try {
    const globalRoomCount = await GlobalRoom.estimatedDocumentCount();
    if (globalRoomCount>0) {
      await GlobalRoom.deleteMany();
    }

    const room = await GlobalRoom.create(req.body);
    return res.status(201).json({message: "success", Object: room});

  } catch (err) {
    return next(err);
  }
};

// Get global room
const getGlobalRoom = async function (req, res, next) {
  try {
    const globalRoom = await GlobalRoom.findOne();

    if (!globalRoom) {
      return res.status(404).json({ message: "Global room not found." });
    }

    return res.status(200).json(globalRoom);

  } catch (err) {
    return next(err);
  }
};

// Update live chat status
const updateGlobalRoom = async function (req, res, next) {
  try {
    const { live_Chat } = req.body;

    if (live_Chat === undefined) {
      return res.status(400).json({ message: "live Chat is required." });
    }

    const updatedRoom = await GlobalRoom.findOneAndUpdate({room_Id: req.params.room_Id},{ live_Chat },{ new: true, runValidators: true });

    if (!updatedRoom) {
      return res.status(404).json({ message: "Global room not found." });
    }

    return res.status(200).json({ message: "success", Object: updatedRoom });

  } catch (err) {
    return next(err);
  }
};



// Delete global room
const deleteGlobalRoom = async function (req, res, next) {
  try {
    const deletedRoom = await GlobalRoom.findOneAndDelete({room_Id: req.params.room_Id});

    if (!deletedRoom) {
      return res.status(404).json({ message: "Global room not found." });
    }

    return res.status(200).json({ message: "Successully deleted."});

  } catch (err) {
    return next(err);
  }
};

module.exports = {createGlobalRoom, getGlobalRoom, updateGlobalRoom, deleteGlobalRoom};