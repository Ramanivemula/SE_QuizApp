const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ✅ User Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        // Create and send token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id,role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.userId).select("-password");
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// ✅ Teacher-Only Route
router.get("/admin-only", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin! You have full access." });
});

// ✅ Teacher-Only Route
router.get("/teacher-only", authMiddleware, roleMiddleware("teacher"), (req, res) => {
  res.json({ message: "Welcome, Teacher! You can create quizzes." });
});

// ✅ Student-Only Route
router.get("/student-only", authMiddleware, roleMiddleware("student"), (req, res) => {
  res.json({ message: "Welcome, Student! You can attempt quizzes." });
});



module.exports = router;
