// ===========================================
// CYBER.DEV Portfolio — Database Schema
// Drizzle ORM + PostgreSQL (Neon)
// ===========================================

import {
  pgTable,
  text,
  varchar,
  timestamp,
  date,
  primaryKey,
  boolean,
  integer,
  serial,
} from "drizzle-orm/pg-core";

// ----- Better Auth Tables -----
// These follow Better Auth's required schema structure

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ----- Application Tables -----

// Experiences (Internships, Competitions, Achievements)
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  companyOrEvent: varchar("company_or_event", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull().default("WORK"), // WORK | COMPETITION | ACHIEVEMENT
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // Nullable if ongoing
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }).notNull(),
  issueDate: date("issue_date").notNull(),
  credentialUrl: text("credential_url"),
  imageUrl: text("image_url"), // Uploaded certificate image
  category: varchar("category", { length: 100 }), // AI, Cyber, Web, Other
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tech Arsenal (Master Data)
export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  iconUrl: text("icon_url"), // SVG/Icon URL
  category: varchar("category", { length: 50 }).notNull().default("OTHER"), // RED_TEAM | WEB_DEV | AI_DATA | DEVOPS | LANGUAGE | OTHER
  experienceYears: integer("experience_years").notNull().default(1),
  experienceMonths: integer("experience_months").notNull().default(0),
});

// Projects & Write-ups
export const projectsWriteups = pgTable("projects_writeups", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // PROJECT | WRITEUP
  category: varchar("category", { length: 100 }), // Academic, Cyber, AI, Web, Tools
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"), // Short description for cards
  content: text("content").notNull(), // Full Markdown/HTML content
  thumbnailUrl: text("thumbnail_url"),
  githubSyncUrl: text("github_sync_url"), // Raw GitHub URL for sync
  demoUrl: text("demo_url"), // Live demo link
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Many-to-Many: Projects/Writeups <-> Technologies
export const itemTechnologies = pgTable(
  "item_technologies",
  {
    itemId: integer("item_id")
      .notNull()
      .references(() => projectsWriteups.id, { onDelete: "cascade" }),
    techId: integer("tech_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.techId] }),
  })
);

// Contact Form Messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Simple Site Statistics
export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  pageViews: integer("page_views").notNull().default(0),
  lastGithubSync: timestamp("last_github_sync"),
  manualProjectsCount: integer("manual_projects_count"),
  manualCertsCount: integer("manual_certs_count"),
  manualCtfsCount: integer("manual_ctfs_count"),
  manualYearsExp: integer("manual_years_exp"),
  manualMonthsExp: integer("manual_months_exp"),
});
