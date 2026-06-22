const express = require('express');
const router = express.Router();
const multer = require('multer');
const mediaController = require('../controllers/mediaController');
const { authenticateToken, requireRole } = require('agriconnect-shared/middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload/produce', authenticateToken, requireRole(['FARMER']), upload.single('image'), mediaController.uploadProduceImage);

module.exports = router;
