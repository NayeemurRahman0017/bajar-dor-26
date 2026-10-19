import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in your .env.local file");
}

const client = new MongoClient(mongoUri);
const db = client.db("bazardor");

export const auth = betterAuth({
  appName: "BazarDor",

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL]
      : []),
  ],

  database: mongodbAdapter(db, {
    client,
  }),

  
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },

  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});