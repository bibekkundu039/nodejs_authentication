import { refreshTokens, verifyJWTToken } from "../services/auth.services.js";

// export const verifyAuthentication = (req, res, next) => {
//   const token = req.cookies.accessToken;
//   if (!token) {
//     res.locals.user = null;
//     return next();
//   }

//   try {
//     const decoded = verifyJWTToken(token);
//     res.locals.user = decoded; //payload
//   } catch (error) {
//     res.locals.user = null;
//   }

//   next();
// };

export const verifyAuthentication = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    res.locals.user = null;
    return next();
  }

  if (accessToken) {
    const decoded = verifyJWTToken(accessToken);
    res.locals.user = decoded; //
    return next();
  }

  if (refreshToken) {
    try {
      const { newAccessToken, newRefreshToken, user } = await refreshTokens(
        refreshToken
      );
      const baseConfig = { httpOnly: true, secure: true };

      res.cookie("accessToken", newAccessToken, {
        ...baseConfig,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        ...baseConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.locals.user = user;

      return next();
    } catch (error) {
      res.locals.user = null;
      console.log(error.message);
    }
  }

  return next();
};
