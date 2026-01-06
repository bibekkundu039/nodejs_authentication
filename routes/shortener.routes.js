import { Router } from "express";
import { postUrlShortner } from "../controllers/postshortener.controller.js";

const router = Router();

router.post("/", postUrlShortner);

export const shortnerRoutes = router;
