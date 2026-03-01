const express = require("express");
const cors = require("cors");
require('dotenv').config();

const connectDB = require('./src/config/db');
/*  routes part */
const authRoutes = require("./src/routes/auth");
// const studentRoutes = require("./src/routes/student");
// const subjectRoutes = require("./src/routes/subjects");
// const scoreRoutes = require("./src/routes/scores");
const teacherRoutes = require("./src/routes/teachers");
// const userRoutes = require("./src/routes/users");
const adminRoutes = require("./src/routes/admin");


const app = express();
app.use(cors());
app.use(express.json());



/*  connect db */
connectDB();

/*  routes */
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("EduMonitor backend running");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running ${PORT}`))

