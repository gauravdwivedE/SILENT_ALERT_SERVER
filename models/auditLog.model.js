const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'CREATE_REPORT',
      'UPDATE_REPORT_STATUS',
      'DELETE_REPORT',
      'EXPORT_DATA',
      'FLAG_MEDIA',
      'UNFLAG_MEDIA',
      'CREATE_ADMIN',
      'DELETE_ADMIN',
      'UPDATE_USER_ROLE',
    ],
  },
  target: {
    type: Object,
    default: {},
    // reportId: "123"
  },

  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  
}, {timestamps: true});

module.exports = mongoose.model('AuditLog', auditLogSchema);
