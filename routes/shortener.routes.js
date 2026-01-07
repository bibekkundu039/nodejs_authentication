import { Router } from "express";
import {
  deleteShortCode,
  getUrlShortnerEditPage,
  postUrlShortner,
  postUrlShortnerEditPage,
} from "../controllers/postshortener.controller.js";

const router = Router();

router.post("/", postUrlShortner);

router
  .route("/edit/:id")
  .get(getUrlShortnerEditPage)
  .post(postUrlShortnerEditPage);

router.post("/delete/:id", deleteShortCode);

export const shortnerRoutes = router;
