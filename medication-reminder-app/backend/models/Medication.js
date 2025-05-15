const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true },
  mealTime: { type: String, required: true },
  notificationTime: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  type: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
});

const Medication = mongoose.model("Medication", medicationSchema);

module.exports = Medication;
