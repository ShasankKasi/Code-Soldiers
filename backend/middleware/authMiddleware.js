const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (make sure your token was signed with { id, email })
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ 
      message: error.name === "TokenExpiredError" 
        ? "Token expired" 
        : "Token is not valid" 
    });
  }
};

module.exports = authMiddleware;
