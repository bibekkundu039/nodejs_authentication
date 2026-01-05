import { Router } from "express";
import {
  getLoginPage,
  getMe,
  getSignupPage,
  postLogin,
  postSignup,
  userLogout,
} from "../controllers/auth.controller.js";

const router = Router();

// router.get("/login", getLoginPage);

router.route("/login").get(getLoginPage).post(postLogin);

// router.get("/signup", getSignupPage);

router.route("/signup").get(getSignupPage).post(postSignup);

router.route("/me").get(getMe);

router.get("/logout", userLogout);

export const authRoutes = router;
