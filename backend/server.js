require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express
const mongoose = require("mongoose"); // Import Mongoose
const cors = require("cors"); // Import CORS middleware
const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes"); 
const attemptRoutes = require("./routes/attemptRoutes");

const app = express(); // Initialize Express app

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes); 
app.use("/api/attempts", attemptRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("🎉 Quiz App API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
