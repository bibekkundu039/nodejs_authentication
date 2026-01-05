import { verifyJWTToken } from "../services/auth.services.js";

export const verifyAuthentication = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = verifyJWTToken(token);
    res.locals.user = decoded; //payload
  } catch (error) {
    res.locals.user = null;
  }

  next();
};
