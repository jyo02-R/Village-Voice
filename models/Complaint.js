const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  mandal: { type: String, required: true },
  village: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "" },
  audio: { type: String, default: "" },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);