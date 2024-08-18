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
const Component = require('../models/Component');

router.get('/', auth, getComponents);
router.get('/:id', auth, getComponentById);
router.post('/', auth, checkAdminRole, (req, res) => { 
  createComponent(req, res); 
});
router.put('/:id', async (req, res) => {
  try {
      const componentId = req.params.id;
      const updatedData = req.body; 
      const component = await Component.findByIdAndUpdate(componentId, { 
          // Update the ratings array
          $push: { ratings: updatedData.ratings } 
      }, { new: true }); // Get the updated component
      if (!component) {
          return res.status(404).json({ msg: 'Component not found' });
      }
      res.json(component); // Send the updated component
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).json({ msg: 'Component not found' });
    }
    res.json({ msg: 'Component removed' });
  } catch (err) {
    console.error('Error deleting component:', err);
    res.status(500).json({ msg: 'Server error' });
  }
},deleteComponent);

module.exports = router;