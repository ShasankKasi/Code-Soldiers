const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      family: 4,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Debug events (useful in dev)
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ Mongoose error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDatabase;
