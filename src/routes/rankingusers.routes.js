import { Router } from "express";
import { getMe, getRanking } from "../controllers/rankingusers.controllers.js";

const router = Router();

router.get("/users/me", getMe);
router.get("/ranking", getRanking);

export default router;
