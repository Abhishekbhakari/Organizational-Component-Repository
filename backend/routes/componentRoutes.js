const express = require('express');
const router = express.Router();
const { 
  getComponents, 
  getComponentById, 
  createComponent, 
  updateComponent, 
  deleteComponent ,
  addComment
} = require('../controllers/componentController');
const {auth ,checkAdminRole} = require('../middleware/auth'); 
const Component = require('../models/Component');

router.get('/', auth, getComponents);
router.get('/:id', auth, getComponentById);
router.post('/', auth, checkAdminRole, (req, res) => { 
  createComponent(req, res); 
});
router.put('/:id', updateComponent);

router.delete('/:id', auth,deleteComponent);

router.put('/:id/comments',addComment);

module.exports = router;