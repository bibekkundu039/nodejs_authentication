import express from "express";
import { authRoutes } from "./routes/auth.routes.js";
import { generalRoutes } from "./routes/general.routes.js";
import cookieParser from "cookie-parser";
import { verifyAuthentication } from "./middlewares/verify-auth-middleware.js";

const app = express();

//ejs
app.set("view engine", "ejs");

// Middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(verifyAuthentication);

// Routes
app.use(authRoutes);
app.use(generalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
