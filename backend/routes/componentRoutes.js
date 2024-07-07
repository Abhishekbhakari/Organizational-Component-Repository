const express = require('express');
const router = express.Router();
const { 
  getComponents, 
  getComponentById, 
  createComponent, 
  updateComponent, 
  deleteComponent 
} = require('../controllers/componentController');
const {auth ,checkAdminRole} = require('../middleware/auth'); 

router.get('/', auth, getComponents);
router.get('/:id', auth, getComponentById);
router.post('/', auth, checkAdminRole, (req, res) => { 
  createComponent(req, res); 
});
router.put('/:id', auth, updateComponent);
router.delete('/:id', auth, deleteComponent);

module.exports = router;