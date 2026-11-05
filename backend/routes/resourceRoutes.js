import express from "express";
import { generateResources } from "../controllers/resourceController.js";

const router = express.Router();

router.post("/generate", generateResources);

export default router;
