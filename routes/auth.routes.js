import { Router } from "express";
import {
  getLoginPage,
  getSignupPage,
  postLogin,
  postSignup,
} from "../controllers/auth.controller.js";

const router = Router();

// router.get("/login", getLoginPage);

router.route("/login").get(getLoginPage).post(postLogin);

// router.get("/signup", getSignupPage);

router.route("/signup").get(getSignupPage).post(postSignup);

export const authRoutes = router;
