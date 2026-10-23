
"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    
    "https://bajar-dor-26.netlify.app",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
