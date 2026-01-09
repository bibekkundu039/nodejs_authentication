import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import requestIp from "request-ip";

import { authRoutes } from "./routes/auth.routes.js";
import { generalRoutes } from "./routes/general.routes.js";
import { verifyAuthentication } from "./middlewares/verify-auth-middleware.js";
import { shortnerRoutes } from "./routes/shortener.routes.js";

const app = express();

//ejs
app.set("view engine", "ejs");

// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestIp.mw());

app.use(verifyAuthentication);

// Routes
app.use(authRoutes);
app.use(generalRoutes);
app.use(shortnerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
