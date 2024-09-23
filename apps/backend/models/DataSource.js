const mongoose = require('mongoose');

const DataSourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Manual Upload', 'API Integration'], required: true },
  fileType: { type: String, enum: ['csv', 'sql'] },
  filePath: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DataSource', DataSourceSchema);
