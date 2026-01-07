import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { shortLinksTable } from "../drizzle/schema.js";
import { url } from "zod";

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

export const getShortLinkById = async (id) => {
  const [result] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.id, id));

  return result ?? null;
};

export const updateShortLink = async ({ id, url, shortCode }) => {
  const result = await db
    .update(shortLinksTable)
    .set({ url, shortCode })
    .where(eq(shortLinksTable.id, id));
  return result;
};

export const deleteShortLink = async (id) => {
  const result = await db
    .delete(shortLinksTable)
    .where(eq(shortLinksTable.id, id));
  return result;
};
