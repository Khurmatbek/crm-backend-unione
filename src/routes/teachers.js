const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { isTeacher } = require("../middleware/role");

const {
  getMySubjects,
  getStudents,
  setScore,
  getAllStudentsWithScores,
  updateScore,
  getStudentsWithScoresByMonth
} = require("../controller/teacherController");

router.get("/subjects", protect, isTeacher, getMySubjects);
router.get("/students",protect, isTeacher, getStudents);
router.post("/score", protect, isTeacher, setScore);
router.put("/score/:scoreId",protect, isTeacher, updateScore);
router.get("/scores", protect, isTeacher, getStudentsWithScoresByMonth);
router.get("/student-scores", protect, isTeacher, getAllStudentsWithScores);


module.exports = router;
