const Medication = require("../models/Medication");

// @desc    Create medication
// @route   POST /api/medications
// @access  Private
exports.createMedication = async (req, res) => {
  try {
    // If auth is used and user is injected
    if (req.user?._id) {
      req.body.user = req.user._id;
    }

    // Calculate the endDate based on duration (example: duration in days)
    if (req.body.duration) {
      const durationInDays = parseInt(req.body.duration);
      if (!isNaN(durationInDays)) {
        const startDate = new Date(req.body.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationInDays - 1); 
        req.body.endDate = endDate;
      }
    }

    const medication = await Medication.create(req.body);
    res.status(201).json({
      success: true,
      data: medication,
    });
  } catch (err) {
    console.error("Error creating medication:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all medications for logged-in user
// @route   GET /api/medications
// @access  Private
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get a single medication by ID
// @route   GET /api/medications/:id
// @access  Private
exports.getMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ success: false, error: "Medication not found" });
    }

    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    res.status(200).json({ success: true, data: medication });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res) => {
  try {
    let medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ success: false, error: "Medication not found" });
    }

    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    // If duration or start date is provided, calculate endDate
    if (req.body.duration && req.body.date) {
      const durationInDays = parseInt(req.body.duration);
      const startDate = new Date(req.body.date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationInDays - 1); 
      req.body.endDate = endDate;
    }

    medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: medication });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ success: false, error: "Medication not found" });
    }

    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    await medication.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};