import { Router } from "express";
import { signIn, signUp } from "../controllers/login.controllers.js";
import {
  signInBodyValidation,
  userSchemaValidation,
} from "../middlewares/loginValidation.middleware.js";

const router = Router();

router.post("/sign-up", userSchemaValidation, signUp);
router.post("/sign-in", signInBodyValidation, signIn);

export default router;
