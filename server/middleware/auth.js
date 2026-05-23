const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Bearer token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    // ✅ ADMIN CHECK (IMPORTANT)
    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Admin access only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};