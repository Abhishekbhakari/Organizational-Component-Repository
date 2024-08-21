const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/adminController');
const { auth, checkAdminRole } = require('../middleware/auth'); 
const User = require('../models/User');


router.get('/users', /*auth, checkAdminRole,*/ getAllUsers);
// DELETE /api/users/:userId 
router.delete('/users/:userId', auth, checkAdminRole, async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('Attempting to delete user with ID:', userId);
        
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Delete the user from the database
        await User.findByIdAndDelete(userId);
        
        // Send a success response
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
