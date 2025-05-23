const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const transactionSchema = new mongoose.Schema({
  id: Number,
  transaction_title: String,
  amount: Number,
  category: String,
  savingOption: String,
  savingAmount: Number,
  date: String,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  transactions: [transactionSchema], 
});

// Add matchPassword method to compare password hashes
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new or modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
