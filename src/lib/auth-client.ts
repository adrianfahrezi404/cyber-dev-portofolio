// ===========================================
// CYBER.DEV Portfolio — Better Auth Client
// Client-side authentication hooks
// ===========================================

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Destructure commonly used hooks and methods
export const {
  signIn,
  signOut,
  useSession,
} = authClient;
