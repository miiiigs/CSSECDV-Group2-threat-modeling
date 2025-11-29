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
 
  /*
  Commented out for now, if its working then delete later
  isLabtech: {        
    type: Boolean, 
    default: false,   
    required: true,
  }, */

  userType: {
    type: String,
    default: "ST",
    required: true
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
