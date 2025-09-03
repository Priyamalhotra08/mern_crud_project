const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controller/userController');

// @route   GET /api/users
router.get('/', getUsers);

// @route   GET /api/users/:id
router.get('/:id', getUser);

// @route   POST /api/users
router.post('/', createUser);

// @route   PUT /api/users/:id
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
router.delete('/:id', deleteUser);

module.exports = router;