import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import profileRoutes from "./routes/memberRoutes.js"
import cookieParser from 'cookie-parser';
import borrowingRoutes from './routes/borrowRoutes.js';
import fineRoutes from './routes/fineRoutes.js';
// Load environment variables FIRST
dotenv.config();

// DEBUG: Check if environment variables are loaded
console.log("=== Environment Variables ===");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? "***" : "UNDEFINED");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("============================");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
// Import sequelize AFTER dotenv is configured
const { default: sequelize } = await import("./config/db.js");

// Test MySQL connection
sequelize
  .authenticate()
  .then(() => console.log(" MySQL Connected Successfully"))
  .catch((err) => console.error(" Connection Error:", err));

// Sync all models
sequelize
  .sync({ alter: false })
  .then(() => console.log(" Models synced with MySQL"))
  .catch((err) => console.log(" Sync error:", err));

// =========================
//        ROUTES
// =========================
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/reservations", reservationRoutes);
app.use('/profile',profileRoutes);
app.use('/borrowings', borrowingRoutes);
app.use('/fines', fineRoutes)
,
// Default Route
app.get("/", (req, res) => {
  res.send("Library Management System API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);

export default app;
