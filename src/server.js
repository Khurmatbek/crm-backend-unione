const express = require("express");
const cors = require("cors");
require('dotenv').config();

const connectDB = require('./config/db');
/*  routes part */
const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teachers");
const adminRoutes = require("./routes/admin");


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

