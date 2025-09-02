const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");

// Load env vars
dotenv.config();

// Connect DB
connectDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // replaces bodyParser.urlencoded()

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
