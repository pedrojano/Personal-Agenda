const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate', authMiddleware, aiController.generateSchedule);

module.exports = router;