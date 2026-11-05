import express from "express";
import { generateRoadmap } from "../controllers/aiController.js";

const router = express.Router();

// Generate an AI roadmap (public or protected depending on auth middleware)
router.post("/generate-roadmap", generateRoadmap);

export default router;
