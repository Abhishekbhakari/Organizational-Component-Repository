const express = require('express');
const router = express.Router();
const { getComponents, getComponentById, createComponent, updateComponent, deleteComponent } = require('../controllers/componentController');
const auth = require('../middleware/auth');

// Define routes
router.get('/', getComponents);
router.get('/:id', getComponentById);
router.post('/', auth, createComponent);
router.put('/:id', auth, updateComponent);
router.delete('/:id', auth, deleteComponent);

module.exports = router;
