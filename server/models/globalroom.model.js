const mongoose = require('mongoose');

const globalRoomSchema = new mongoose.Schema(
  { 
    room_Id: { type: String, unique: true, immutable : true},        
    live_Chat: { type: Boolean, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model('GlobalRoom', globalRoomSchema);