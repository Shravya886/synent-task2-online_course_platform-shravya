const jwt = require("jsonwebtoken");

// CHECK LOGIN
const verifyToken = (req, res, next) => {
  const auth = req.header("Authorization");

  if (!auth) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// CHECK ADMIN
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };