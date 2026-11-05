import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

// 🔥 FIX: env load with path
dotenv.config({ path: "./.env" });

// 🔍 DEBUG (temporary)
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/resources", resourceRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await db.query("SELECT 1");
    console.log("Database Connected ✅");
  } catch (err) {
    console.warn("DB Connection Failed:", err.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
