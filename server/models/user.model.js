const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  { 
    userId: { type: String, unique: true, immutable : true},
    personalNumber: { type: String, required: true, unique: true , 
      immutable: true, 
      match: [/^\d{10}$/, 'Personal number must be exactly 10 digits']},
    language: { type: String, default: 'en' },
    password: { type: String, required: true, select: false },
    anonymousName: {type: String, required: false}
  },
  { timestamps: true }
);

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
        next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(loginPassword) {
  return bcrypt.compare(loginPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);