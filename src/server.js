import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import config from "./config/sys.config.js";
import logger from "./utils/logger.js";

import emailRoutesV1 from "./routes/v1/email.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || config.PORT || 3030;

app.use(express.json());
app.use(cors());

if (process.env.DEBUG_MODE === "true") {
    app.use(
        process.env.NODE_ENV !== "production"
            ? morgan("dev")
            : morgan("combined")
    );
}

// API Status Check
app.get("/", (_req, res) => {
    res.json({
        message: "api-tenghuey is live",
        description: "API is running smoothly.",
        version: "1.0.0"
    });
});

// Load Routes (Prevent Crash)
try {
    app.use("/api/v1/emails", emailRoutesV1);
} catch (err) {
    logger.error(`❌ Error loading routes: ${err.message}`);
}

// Catch 404 Routes
app.use("*", (_req, res) => {
    res.status(404).json({ error: "Not Found", message: "Invalid API endpoint" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(`🔥 Server Error: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Ensure Port Binding
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
