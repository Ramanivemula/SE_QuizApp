const express = require("express");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ✅ Create Quiz (Only for Teachers)
router.post("/", authMiddleware, roleMiddleware("teacher"), async (req, res) => {
    try {
        const { title, description, subject, difficulty, questions } = req.body;
        
        const quiz = new Quiz({
            title,
            description,
            subject,
            difficulty,
            questions,
            createdBy: req.user.userId // Logged-in teacher
        });

        await quiz.save();
        res.status(201).json({ message: "Quiz created successfully", quiz });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get All Quizzes (Accessible to All Users)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("createdBy", "name email");
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get Single Quiz by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update Quiz (Only for the Teacher who created it)
router.put("/:id", authMiddleware, roleMiddleware("teacher"), async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        if (quiz.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only edit your own quizzes" });
        }

        Object.assign(quiz, req.body);
        await quiz.save();

        res.json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Delete Quiz (Only for the Teacher who created it)
router.delete("/:id", authMiddleware, roleMiddleware("teacher"), async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        if (quiz.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only delete your own quizzes" });
        }

        await quiz.deleteOne();
        res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
