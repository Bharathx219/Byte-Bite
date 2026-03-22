const jwt = require("jsonwebtoken");
const HttpError = require("../utils/httpError");

const protect = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized. Missing token."));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_error) {
    return next(new HttpError(401, "Invalid or expired token."));
  }
};

const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new HttpError(403, "Forbidden. Admin access required."));
  }
  return next();
};

module.exports = { protect, adminOnly };
