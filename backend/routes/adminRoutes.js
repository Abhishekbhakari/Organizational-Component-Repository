const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/adminController');
// const { auth, checkAdminRole } = require('../middleware/auth'); 

router.get('/users', /*auth, checkAdminRole,*/ getAllUsers);


module.exports = router;
