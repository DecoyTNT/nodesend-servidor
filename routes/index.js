const express = require('express');

const router = express.Router();

// /api
router.use('/usuarios', require('./usuarios'));
router.use('/auth', require('./auth'));
router.use('/enlaces', require('./enlaces'));
router.use('/archivos', require('./archivos'));

module.exports = router;