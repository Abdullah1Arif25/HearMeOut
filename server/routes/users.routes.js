const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controller');

// POST /api/users/register
router.post('/register', UserController.registerUser);

// POST /api/users/login
router.post('/login',UserController.loginUser);

// GET /api/users
router.get('/',UserController.getAllUsers);

// GET /api/users/:UserId
router.get('/:userId', UserController.getAUser);

// update /api/users/:userId
router.patch("/:userId" ,UserController.updateAUser);

// Delete /api/users/:userId
router.delete("/:userId" ,UserController.deleteAUser);


module.exports = router;
