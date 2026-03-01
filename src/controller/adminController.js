const Student = require("../models/Student");
const Subject = require("../models/Subject");

exports.createStudent = async (req, res) => {
  try {
    const { firstName, lastName, className } = req.body;

    if (!firstName || !lastName || !className) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = new Student({ firstName, lastName, className });
    await student.save();

    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const subject = new Subject({ name});
    await subject.save();

    res.status(201).json({ success: true, subject });

  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}
