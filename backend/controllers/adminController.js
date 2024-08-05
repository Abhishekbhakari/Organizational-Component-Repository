const { response } = require('express');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);  // Changed from response.json to res.json
        console.log(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
