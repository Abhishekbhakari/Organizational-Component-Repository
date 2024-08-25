const express = require('express');
const router = express.Router();
const { getAllUsers,deleteUser } = require('../controllers/adminController');
const { auth, checkAdminRole } = require('../middleware/auth'); 
const User = require('../models/User');



router.get('/users', /*auth, checkAdminRole,*/ getAllUsers);

router.delete('/users/:userId', auth, checkAdminRole, deleteUser);



module.exports = router;
