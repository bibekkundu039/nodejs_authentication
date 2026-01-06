import { relations } from "drizzle-orm";
import {
  mysqlTable,
  int,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const shortLinksTable = mysqlTable("short_link", {
  id: int().autoincrement().primaryKey(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: int()
    .notNull()
    .references(() => usersTable.id),
});

//User can have many short links
export const usersRelation = relations(usersTable, ({ many }) => ({
  shortLink: many(shortLinksTable),
}));

//short links belongs to a user
export const shortLinkRelation = relations(shortLinksTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [shortLinksTable.userId], // forign key
    references: [usersTable.id],
  }),
}));
