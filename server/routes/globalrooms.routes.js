const express = require('express');
const router = express.Router();
const {createGlobalRoom, getGlobalRoom, updateGlobalRoom, deleteGlobalRoom} = require('../controllers/globalrooms.controller');

// POST /api/globalrooms
router.post('/', createGlobalRoom);

// GET /api/globalrooms
router.get('/', getGlobalRoom);

// PUT /api/globalrooms/:room_Id
router.put('/:room_Id', updateGlobalRoom);

// Delete /api/globalrooms/:room_Id
router.delete('/:room_Id', deleteGlobalRoom);

module.exports = router;