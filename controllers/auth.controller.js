import { name } from "ejs";
import {
  clearUserSession,
  createAccessToken,
  createRefreshToken,
  createSession,
  createUser,
  // generateJWTToken,
  getLoginUser,
  getUserByEmail,
  hashPassword,
  verifyPassword,
} from "../services/auth.services.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validators/auth-validator.js";

export const getLoginPage = async (req, res) => {
  if (res.locals.user) return res.redirect("/");
  res.render("auth/login", { errors: req.flash("error") });
};
export const getSignupPage = async (req, res) => {
  if (res.locals.user) return res.redirect("/");
  res.render("auth/signup", { errors: req.flash("error") });
};

export const postLogin = async (req, res) => {
  if (res.locals.user) return res.redirect("/");

  const result = loginUserSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues?.[0]?.message || "Invalid input";
    req.flash("error", message);
    return res.redirect("/login"); // 🔴 MUST return
  }

  // ✅ At this point, data is guaranteed
  const { email, password } = result.data;

  //check user form data
  if (!email || !password) return res.status(400).send("Invalid credentials");

  //check user already logged in or not
  if (req.cookies.user) return res.redirect("/");

  //check user in database
  const user = await getUserByEmail(email);
  console.log("User logged in:", user);

  //check user present or not
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/login");
  }

  const verifiedPassword = await verifyPassword(password, user.password);

  //check password
  if (!verifiedPassword) {
    req.flash("error", "Incorrect password");
    return res.redirect("/login");
  }

  //we need to create a session
  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionId: session.id,
  });

  const refreshToken = createRefreshToken({ sessionId: session.id });

  const baseConfig = { httpOnly: true, secure: true };

  res.cookie("accessToken", accessToken, {
    ...baseConfig,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseConfig,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.redirect("/");
  // res.render("index", { user });
};

export const postSignup = async (req, res) => {
  // const { name, email, password } = req.body;

  if (res.locals.user) return res.redirect("/");

  const result = registerUserSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues?.[0]?.message || "Invalid input";
    req.flash("error", message);
    return res.redirect("/signup"); // 🔴 MUST return
  }

  // ✅ At this point, data is guaranteed
  const { name, email, password } = result.data;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    req.flash("error", "User already exists");
    return res.redirect("/signup");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({ name, email, password: hashedPassword });

  console.log("Inserted user:", user);

  res.redirect("/login");
};

export const getMe = async (req, res) => {
  if (!res.locals.user) return res.redirect("/login");

  const user = res.locals.user;

  res.send(`Hello, ${user.name}! and your email is ${user.email}`);
};

export const userLogout = async (req, res) => {
  await clearUserSession(res.locals.user.sessionId);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/login");
};
