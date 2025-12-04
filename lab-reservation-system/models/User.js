const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
    // Maybe ID will become the "username"? so instead of havina separate username, maybe 
    // use id for convenience + thats how DLSu's systems work
  id: {
    type: Number,
    required: true,
    unique: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  middleName: {
    type: String,
    required: false
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  pronouns: {
    type: String,
    default: ''
  },

  phoneNum: {
    type: String,
  },

  bio: {
    type: String,
    default: ""
  },
 

  role: {
    type: String,
    enum: ['admin', 'labtech', 'student'],
    required: true,
    default: 'student'
  },

  accountLocked: {
    type: Boolean,
    default: false
  },

  failedLoginAttempts: {
    type: Number,
    default: 0
  },

  passwordHistory: {
    type: [String],
    default: []
  },

  lastLogin: {
    type: Date
  },

  lastFailedLogin: {
    type: Date
  },

  profilePicture: {
  data: Buffer,
  contentType: String
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is new or modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
