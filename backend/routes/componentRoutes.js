const express = require('express');
const router = express.Router();
const { getComponents, getComponentById, createComponent, updateComponent, deleteComponent } = require('../controllers/componentController');
const auth = require('../middleware/auth');

// Define routes
router.get('/', auth, getComponents);
router.get('/:id', auth, getComponentById);
router.post('/', auth, checkAdminRole, createComponent); // Add checkAdminRole middleware
router.put('/:id', auth, updateComponent);
router.delete('/:id', auth, deleteComponent);

module.exports = router;