import mysql from "mysql2";
import dbConfig from "../../config/sys.config.js";
import logger from "../../utils/logger.js";

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    multipleStatements: true, // Required for executing multiple queries in one call
    waitForConnections: true,
    connectionLimit: 50, // Increased for production
    queueLimit: 500, // Prevents excessive memory usage
    dateStrings: true,
});

// Connection issues & auto-reconnect
pool.getConnection((err, conn) => {
    if (err) {
        logger.error("❌ Database Connection Error:", err.message);
    } else {
        logger.debug("✅ Successfully connected to the database.");
        conn.release();
    }
});

pool.on("error", (err) => {
    logger.error("❌ Database Connection Lost:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        logger.debug("🔄 Reconnecting to the database...");
    }
});

// Export promise-based pool
export default pool.promise();
