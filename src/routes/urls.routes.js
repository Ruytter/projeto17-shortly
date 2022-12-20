import { Router } from "express";
import { urlShorter, getUrlById, openUrl, removeUrlById } from "../controllers/urls.controllers.js";
import {
    urlValidation,
    idValidation
} from "../middlewares/urlIdValidation.middlewere.js";

const router = Router();


router.post("/urls/shorten", urlValidation, urlShorter);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", openUrl);
router.delete("/urls/:id", idValidation, removeUrlById);

export default router;