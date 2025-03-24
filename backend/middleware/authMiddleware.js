const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("Auth Header:", authHeader); // Debugging log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
