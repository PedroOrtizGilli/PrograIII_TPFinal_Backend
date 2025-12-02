import { Router } from "express";
import { sales } from "../src/api/controllers/sales.controllers.js"

const router = Router();

router.post("/", sales);

export default router;