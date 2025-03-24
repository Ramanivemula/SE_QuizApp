const express = require("express");
const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Start a Quiz Attempt (Student)
router.post("/:quizId/start", authMiddleware, roleMiddleware("student"), async (req, res) => {
    try {
        const { quizId } = req.params;
        const studentId = req.user.userId;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const attempt = new Attempt({ student: studentId, quiz: quizId, responses: [] });
        await attempt.save();

        res.status(201).json({ message: "Quiz attempt started", attemptId: attempt._id });
    } catch (error) {
        console.error("Error starting quiz attempt:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Submit Quiz Attempt
router.post("/:attemptId/submit", authMiddleware, roleMiddleware("student"), async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { responses } = req.body; // Array of { questionId, selectedAnswer }

        const attempt = await Attempt.findById(attemptId).populate("quiz");
        if (!attempt) return res.status(404).json({ message: "Attempt not found" });

        // Calculate Score
        let score = 0;
        attempt.quiz.questions.forEach((question) => {
            const userResponse = responses.find(res => res.questionId === question._id.toString());
            if (userResponse && question.correctAnswer === userResponse.selectedAnswer) {
                score += 1;
            }
        });

        attempt.responses = responses;
        attempt.score = score;
        attempt.status = "completed";

        await attempt.save();
        res.json({ message: "Quiz submitted successfully", score });
        console.log("Received Responses:", responses);
        console.log("Quiz Questions:", attempt.quiz.questions);

    } catch (error) {
        console.error("Error submitting quiz attempt:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Quiz Attempt Results
router.get("/:attemptId", authMiddleware, async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate("quiz");
        if (!attempt) return res.status(404).json({ message: "Attempt not found" });

        res.json(attempt);
    } catch (error) {
        console.error("Error fetching quiz attempt:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
