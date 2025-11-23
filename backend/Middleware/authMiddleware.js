const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .staus(401)
      .json({
        success: false,
        error: "no toker",
        message: "Authentication token missing",
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "TokenExpired",
        message: "Your login session has expired. Please login again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "InvalidToken",
        message: "Invalid authentication token",
      });
    }

    // Unexpected error
    return res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Something went wrong",
    });
  }
};

module.exports = auth;
