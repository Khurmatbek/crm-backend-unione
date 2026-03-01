const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    className: {
      type: String, // 5-A, 6-B
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
