const JWT = require("jsonwebtoken");
const User =  require("../models/user");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.taskifyUserToken;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // Attach the user to request
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};


module.exports = authMiddleware;