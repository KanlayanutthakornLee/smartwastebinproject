import express from "express";
import { getBins } from "./bin.controller.js";

const router = express.Router();

router.get("/", getBins);

export default router;