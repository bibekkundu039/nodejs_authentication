import { Router } from "express";
import { getHomePage } from "../controllers/general.controller.js";

const router = Router();

router.get("/", getHomePage);

export const generalRoutes = router;
