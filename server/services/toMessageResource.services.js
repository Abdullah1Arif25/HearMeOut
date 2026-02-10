function toMessageResource(message,branchingRoomId){
    const messageId = message.messageId;

    return {
            ...message.toObject(),
            "_links":{
                "self":{
                    href:`/branchingRooms/${branchingRoomId}/messages/${messageId}`,
                    method: "GET"

                },
                "createResponse":{
                    href:`/branchingRooms/${branchingRoomId}/messages/${messageId}`,
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                },
                "updateMessage":{
                    href:`/branchingRooms/${branchingRoomId}/messages/${messageId}`,
                    method: "PATCH"
                },
                "deleteMessage":{
                    href:`/branchingRooms/${branchingRoomId}/messages/${messageId}`,
                    method: "DELETE"
                },
                "reactToMessage":{
                    href:`/branchingRooms/${branchingRoomId}/messages/${messageId}/reactions`,
                    method: "POST"
                }
            }
        }


}


module.exports = {toMessageResource}