const mongoose = require('mongoose');

const DataEntrySchema = new mongoose.Schema({
  dataSource: { type: mongoose.Schema.Types.ObjectId, ref: 'DataSource', required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DataEntry', DataEntrySchema);
