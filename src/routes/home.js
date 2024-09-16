// src/routes/home.js
const express = require('express');
const path = require('path');
const checkAuth = require('../middleware/check_auth');
const router = express.Router();

router.get('/home', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

module.exports = router;