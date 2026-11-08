import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import config from "./configs/config.js";

// APIs
import healthRoutes from "./routes/health.routes.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Request logging (development only)
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/health", healthRoutes);

export default app;