import express from "express";
import roadmapController from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/my-roadmap", roadmapController.getUserRoadmap);

export default router;
