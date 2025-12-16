const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['parent', 'staff', 'admin', 'superAdmin'],
    default: 'parent', // Default role is 'parent'
  },
  staffRole: {
    // Sub-role for staff accounts
    type: String,
    enum: ['caregiver', 'teacher', 'cook'],
  },
  phone: {
    type: String,
  },
  experience: {
    // Years of experience (for staff)
    type: Number,
    min: 0,
  },
  joiningDate: {
    // Joining date (for staff)
    type: Date,
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  adminRequest: {
    // Tracks whether the user has requested admin role
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // Default is pending
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
