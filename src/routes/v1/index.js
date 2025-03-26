import jwt from "jsonwebtoken";
import config from "../../config/sys.config.js";
import logger from "../../utils/logger.js";

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        logger.error("❌ [MIDDLEWARE] Unauthorized: Missing token");
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    jwt.verify(token, config.ACCESS_TOKEN, (err, user) => {
        if (err) {
            logger.error("❌ [MIDDLEWARE] Forbidden: Invalid token");
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        logger.debug("🔐 [MIDDLEWARE] Token verified successfully");
        req.user = user;
        next();
    });
};
