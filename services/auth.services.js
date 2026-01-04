import { and, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
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

export const generateJWTToken = ({ id, name, email }) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
