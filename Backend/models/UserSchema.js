const { Schema, default: mongoose } = require('mongoose');

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ['attendee', 'exhibitor', 'organizer'],
    default: 'attendee'
  },
  status: {
    type: String,
    enum: ['NotAttended', 'Attended'],
    default: 'NotAttended'
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
