const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ UPDATED ROLE FIELD
  role: {
    type: String,
    enum: ["author", "editor", "reviewer", "admin"],
    default: "author",
  },
});

module.exports = mongoose.model("User", userSchema);