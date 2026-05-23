// ===========================================
// CYBER.DEV Portfolio — Better Auth Configuration
// Server-side authentication setup
// ===========================================

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // Email + Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Single admin user, no need
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh session token daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache session cookie for 5 minutes
    },
  },

  // Rate limiting for auth routes (brute-force protection)
  rateLimit: {
    window: 15 * 60, // 15 minutes
    max: 5, // Max 5 attempts per window
  },

  // Advanced configuration
  advanced: {
    cookiePrefix: "cyberdev",
    generateId: false, // Use Better Auth's default ID generation
  },

  // Trust proxy headers (required for Vercel)
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

// Export auth types
export type Session = typeof auth.$Infer.Session;
