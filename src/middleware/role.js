
exports.isTeacher = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  console.log("User role:", req.user.role);
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher access only" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

