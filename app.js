import express from "express";
import { authRoutes } from "./routes/auth.routes.js";
import { generalRoutes } from "./routes/general.routes.js";
import cookieParser from "cookie-parser";
import { ne } from "drizzle-orm";
import jwt from "jsonwebtoken";

const app = express();

//ejs
app.set("view engine", "ejs");

// Middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded; //payload
  } catch (error) {
    res.locals.user = null;
  }

  next();
});

// Routes
app.use(authRoutes);
app.use(generalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
