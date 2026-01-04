import {
  createUser,
  generateJWTToken,
  getLoginUser,
  getUserByEmail,
  hashPassword,
  verifyPassword,
} from "../services/auth.services.js";

export const getLoginPage = async (req, res) => {
  res.render("auth/login");
};
export const getSignupPage = async (req, res) => {
  res.render("auth/signup");
};

export const postLogin = async (req, res) => {
  // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;");

  const { email, password } = req.body;

  //check user form data
  if (!email || !password) return res.status(400).send("Invalid credentials");

  //check user already logged in or not
  if (req.cookies.user) return res.redirect("/");

  //check user in database
  const user = await getUserByEmail(email);
  console.log("User logged in:", user);

  //check user present or not
  if (!user) return res.status(400).send("Invalid User");

  const verifiedPassword = await verifyPassword(password, user.password);

  //check password
  if (!verifiedPassword) return res.status(400).send("Invalid Password");

  //generate token
  const token = generateJWTToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  //set cookie
  // res.cookie("isLoggedIn", true);
  // res.cookie("user", user.email);

  //set cookie
  res.cookie("accessToken", token);

  res.redirect("/");
  // res.render("index", { user });
};

export const postSignup = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({ name, email, password: hashedPassword });

  console.log("Inserted user:", user);

  res.redirect("/login");
};
