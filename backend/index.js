const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");

// Load env vars
dotenv.config();

// Connect DB
connectDatabase();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
// index.js in backend
const corsOptions = {
  origin: [
    process.env.frontend_url,
    process.env.frontend_url_2,
  ],
  credentials: true, // if using cookies
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});