const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    responses: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedAnswer: { type: String, required: true }
        }
    ],
    score: { type: Number, default: 0 },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" }
}, { timestamps: true });

module.exports = mongoose.model("Attempt", attemptSchema);
