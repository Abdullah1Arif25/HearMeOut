const express = require('express');
const MessagesRoute = express.Router();
const Message = require('../models/message.model');
const { Query } = require('mongoose');
const { translateText } = require("../services/translation.services");



// POST createMessage
const createMessage = async function(req, res, next){
  try {
    if (!req.body.Body || req.body.Body.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }
    if (!req.body.Sender) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!req.body.BranchingRoom) {
      return res.status(400).json({ message: "Branching Room is required" });
    }

    const randomSix = Math.floor(100000 + Math.random() * 900000);
    const messageId = req.body.messageId || ("messageId" + randomSix);

    const newMessage = await Message.create({
    messageId,
    Body: req.body.Body,
    Sender: req.body.Sender,
    BranchingRoom: req.body.BranchingRoom,
    SendTimestamp: new Date(),
    Reaction: null,
    ResponseIds: []
});
    res.status(201).json({message:"Success", Object: newMessage});
    
  } catch (err) {
    next(err);
  }
  
};

// POST createResponseMessage
const createResponseMessage = async function(req, res, next){
  try {
//Check if the Message Already exists
        const originalMessageId = req.params.messageId;
        const originalMessage = await Message.findOne({messageId: originalMessageId});

        if(!originalMessage){ return res.status(409).json({message:"The Message Does not exists"});}

        const newReponseMessage = await Message.create(req.body);

        originalMessage.ResponseIds.push(newReponseMessage._id);
        const savedOriginalMessage = await originalMessage.save();
        await savedOriginalMessage.populate("ResponseIds");

        res.status(201).json({message: "Success", Object: newReponseMessage});


  } catch (err) {
    next(err);
  }

};



// GET getMessageById with Filtering, Sorting, Field Selection and Pagination based on fields provided
const getAllMessages = async function(req, res, next){
  try{

    // Filtering
    const filters = {};

    if(req.query.Sender !== undefined) filters.Sender = req.query.Sender;
    if(req.query.BranchingRoom !== undefined) filters.BranchingRoom = req.query.BranchingRoom;

    let query = Message.find(filters);

    // Sorting
    if(req.query.sort){
      const sortByField = req.query.sort.split(",").join(" ");
      query = query.sort(sortByField);
    } else{
      query = query.sort("-createdAt");
    }

    //Field Selection

    if(req.query.fields){
      const selectedField = req.query.fields.split(",").join(" ");
      query = query.select(selectedField + " messageId");
    }
    //pagination
    const limit = parseInt(req.query.limit , 10) || 10;
    const page = parseInt(req.params.page, 1) || 1;
    const skip = (page -1)*limit;

    query = query.skip(skip).limit(limit);
    

    const messages = await query.populate("Sender").populate("BranchingRoom");

    res.status(200).json({
      status: "Success", 
      result: messages.length,
      limit: limit,
      data: messages,

    })
    

  } catch(err){
      next(err);
  }

}


// GET getMessageById
const getMessageById = async function(req, res, next){
  try {
    const message = await Message.findOne({messageId:req.params.messageId}).populate('Sender').populate('BranchingRoom').populate('ResponseIds');
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
};


// GET Translate message
const translateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const targetLang = req.query.target;

    if (!targetLang) {
      return res.status(400).json({
        error: "target language required ?target=xx"
      });
    }

    const msg = await Message.findOne({ messageId });
    if (!msg) {
      return res.status(404).json({ error: "Message not found" });
    }

    const result = await translateText({
      messageId: msg.messageId,
      text: msg.Body,
      target: targetLang
    });

    console.log("TRANSLATION RESULT:", result);

    return res.status(200).json({
      translated: result.translated,
      cached: result.cached
    });

  } catch (err) {
    next(err);
  }
};



// PATCH patchMessage
const updateMessageById = async function(req, res, next)  {
  try {
    const patchedMessage = await Message.findOneAndUpdate(
      {messageId: req.params.messageId},
      req.body,
      { new: true, runValidators: true }
    );

    if (!patchedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({message: "success", Object: patchedMessage});

  } catch (err) {
    next(err);
  }
};


// DELETE allMessages
const deleteAllMessages = async (req, res) => {
  try {
      await Message.deleteMany({});
      res.status(200).json({ message: "All messages deleted" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



// DELETE deleteMessage
const deleteMessageById = async function(req, res, next)  {
  try {
    const deletedMessage = await Message.findOneAndDelete({
        messageId: req.params.messageId
    });

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({message: "Successs"});
  } catch (err) {
    next(err);
  }
};





module.exports = {createResponseMessage,createMessage, getAllMessages, getMessageById, translateMessage, updateMessageById, deleteAllMessages, deleteMessageById}