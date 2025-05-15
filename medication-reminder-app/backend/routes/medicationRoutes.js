const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const protect = require('../middlewares/auth');

router.post('/', protect, medicationController.createMedication);
router.get('/', protect, medicationController.getMedications);
router.get('/:id', protect, medicationController.getMedication);
router.put('/:id', protect, medicationController.updateMedication);
router.delete('/:id', protect, medicationController.deleteMedication);

module.exports = router;