const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
