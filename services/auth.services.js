import { and, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { sessionTable, usersTable } from "../drizzle/schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return await argon2.hash(password);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await argon2.verify(hashedPassword, password);
};

export const getUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
};

export const createUser = async ({ name, email, password }) => {
  const user = await db.insert(usersTable).values({ name, email, password });

  return user;
};

export const getLoginUser = async (email, password) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), eq(usersTable.password, password)));

  return user;
};

// export const generateJWTToken = ({ id, name, email }) => {
//   return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

export const createSession = async (userId, { ip, userAgent }) => {
  const [session] = await db
    .insert(sessionTable)
    .values({ userId, ip, userAgent })
    .$returningId();

  return session;
};

//create access token
export const createAccessToken = ({ id, name, email, sessionId }) => {
  return jwt.sign({ id, name, email, sessionId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

//create refresh token
export const createRefreshToken = ({ sessionId }) => {
  return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const findSessionById = async (sessionId) => {
  const [session] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId));
  return session;
};

export const findUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return user;
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decoded = verifyJWTToken(refreshToken);
    const { sessionId } = decoded;
    const session = await findSessionById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const user = await findUserById(session.userId);

    if (user) {
      const newAccessToken = createAccessToken({
        id: user.id,
        name: user.name,
        email: user.email,
        sessionId: session.id,
      });
      const newRefreshToken = createRefreshToken({ sessionId: session.id });
      return { newAccessToken, newRefreshToken, user };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
  }
};

export const clearUserSession = async (sessionId) => {
  return await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
};
