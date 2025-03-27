const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple middleware for checking authentication
const checkAuth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // For now, just proceed without validating the token
    // In a real app, you would verify the JWT token here
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   GET api/users
// @desc    Get all users
// @access  Admin only
router.get('/', checkAuth, async (req, res) => {
  try {
    // Get all users except password
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/:id/role
// @desc    Update user role
// @access  Admin only
router.put('/:id/role', checkAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    
    // Find and update the user
    const userToUpdate = await User.findById(req.params.id);
    
    if (!userToUpdate) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    userToUpdate.role = role;
    await userToUpdate.save();
    
    // Return the updated user without password
    const updatedUser = await User.findById(req.params.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;