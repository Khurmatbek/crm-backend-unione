const Subject = require("../models/Subject");
const Student = require("../models/Student");
const Score = require("../models/Score");

exports.getMySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*  student list */

exports.getStudents = async (req, res) => {
  try {
    const { search, classname, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    if (classname) query.className = className;

    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Student.countDocuments(query)

    res.json({
      data: students,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/*  ball qoyish */
exports.setScore = async (req, res) => {
  try {
    const { studentId, subjectId, score, date } = req.body;

    const result = await Score.findOneAndUpdate(
      {
        student: studentId,
        subject: subjectId,
        date,
      },
      {
        student: studentId,
        subject: subjectId,
        score,
        date,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*  update score */

exports.updateScore = async (req, res) => {
  try {
    const { scoreId } = req.params;
    const { score } = req.body;

    const updatedScore = await Score.findByIdAndUpdate(
      scoreId,
      { score },
      { new: true }
    );

    if (!updatedScore) {
      return res.status(404).json({ message: "Score not found" });
    }

    res.json(updatedScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*  get studentFull */
exports.getAllStudentsWithScores = async (req, res) => {
  try {
    // Barcha studentlar
    const students = await Student.find();

    // Har bir studentga score’larni qo‘shish
    const studentsWithScores = await Promise.all(
      students.map(async (student) => {
        const scores = await Score.find({ student: student._id })
          .populate("subject", "name") // faqat subject name
          .sort({ date: -1 });
        return {
          ...student.toObject(),
          scores, // student object ichida scores array
        };
      })
    );

    res.json({ success: true, students: studentsWithScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*  get score with month */
exports.getStudentsWithScoresByMonth = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    if (!month || !year) {
      return res.status(400).json({ message: "Month va year kerak" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1️⃣ Total student count
    const totalStudents = await Student.countDocuments();

    // 2️⃣ Paginated students
    const students = await Student.find()
      .skip(skip)
      .limit(limit);

    // 3️⃣ Studentlar bilan score’larni olish
    const studentsWithScores = await Promise.all(
      students.map(async (student) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const scores = await Score.find({
          student: student._id,
          date: { $gte: start, $lte: end },
        }).populate("subject", "name");

        return {
          ...student.toObject(),
          scores,
        };
      })
    );

    // 4️⃣ Response bilan pagination info
    res.json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalStudents / limit),
      totalStudents,
      students: studentsWithScores,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




