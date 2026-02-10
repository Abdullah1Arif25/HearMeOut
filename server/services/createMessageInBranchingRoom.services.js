const Message = require('../models/message.model');
const BranchingRoom = require('../models/branchingroom.model');
const GlobalRoom = require('../models/globalroom.model');
const LocalRoom = require('../models/localroom.model');

async function createMessageInABranchingRoom(branchingRoomId, anonymousName ,MessageBody){
    const branchingRoom = await BranchingRoom.findOne({branchingRoomId});
    if(!branchingRoom){
        throw new Error("Branching Room Does not exist");
    }
    const branchingRoomObjectId = branchingRoom._id;

    let chatEnabled = true;

    if (branchingRoom.branchingRoomType === "GlobalRoom") {
        const globalRoom = await GlobalRoom.findOne();
        chatEnabled = globalRoom?.live_Chat;
    }

    if (branchingRoom.branchingRoomType === "LocalRoom") {
        const localRoom = await LocalRoom.findById(branchingRoom.parentRoomId);
        chatEnabled = localRoom?.liveChat;
    }

    if (!chatEnabled) {
        throw new Error("chatPaused");
    }

    const newMessage = await Message.create({...MessageBody, BranchingRoom: branchingRoomObjectId, anonymousName : anonymousName});

    return newMessage;

}

module.exports = {createMessageInABranchingRoom};


