const mongoose = require('mongoose');


const LocalRoomSchema  = new mongoose.Schema({
    roomId : {type: String, required: [true, "Id is Required"], unique: true, immutable : true},
    country : {type: String},
    liveChat: {type: Boolean, required: true}



},{timestamp: true});






module.exports =  mongoose.model("LocalRoom", LocalRoomSchema);