import { Router } from "express";
import { insertUser } from "../src/api/controllers/user.controllers.js";
const router = Router();

router.post("/", insertUser);

export default router;

