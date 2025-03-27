const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Simple middleware for checking authentication (inline to avoid issues)
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
    req.user = { id: 'tempUserId' }; // Temporary user ID for testing
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', checkAuth, async (req, res) => {
  try {
    // For now, return mock data
    res.json({
      items: [
        {
          product: {
            _id: '1',
            name: 'Test Product',
            price: 19.99,
            category: 'Test Category',
            imageUrl: 'https://via.placeholder.com/150'
          },
          quantity: 2
        }
      ]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', [
  checkAuth,
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { productId, quantity } = req.body;
  
  try {
    // For now, return success response
    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/cart/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put('/:productId', [
  checkAuth,
  [
    check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    res.json({ success: true, message: 'Item quantity updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', checkAuth, async (req, res) => {
  try {
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', checkAuth, async (req, res) => {
  try {
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;