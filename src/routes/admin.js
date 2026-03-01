const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { createStudent } = require("../controller/adminController");
const { createSubject } = require("../controller/adminController");

// Student yaratish
router.post("/student", protect, isAdmin, createStudent);
// Subject yaratish
router.post("/subject", protect, isAdmin, createSubject);

module.exports = router;
