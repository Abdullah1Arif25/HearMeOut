const BranchingRoom = require('../models/branchingroom.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');


async function reactToMessageInBranchingRoom(payload){
        const { branchingRoomId, messageId , userId, reaction} = payload;

        const validReactions = ['👍', '❤️', '😂', '😢', '😡'];

        if (!validReactions.includes(reaction)) {
            throw new Error("Invalid reaction");
        }

        // Make sure room exists
        const branchingRoomExists = await BranchingRoom.findOne({ branchingRoomId:branchingRoomId });
        if (!branchingRoomExists) {
            throw new Error("Branching room not found" );
        }

        // Find message by messageId
        const message = await Message.findOne({
            messageId: messageId
        });

        if (!message) {
            throw new Error("Message not found" );
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found" );
        }


        // Save reaction
        message.Reactions.push({userId:userId, reaction: reaction});
        const savedMessage = await message.save();
        await savedMessage.populate("Reactions");
        return savedMessage;
};

module.exports = {reactToMessageInBranchingRoom};