import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { shortLinksTable } from "../drizzle/schema.js";

export const getAllShortLinks = async ({ userId }) => {
  const result = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, userId));
  return result;
};

export const getShortLinkByShortCode = async (shortCode) => {
  const [result] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.shortCode, shortCode));
  return result ?? null;
};

export const insertShortLink = async ({ url, shortCode, userId }) => {
  const result = await db
    .insert(shortLinksTable)
    .values({ url, shortCode, userId });
  return result;
};
