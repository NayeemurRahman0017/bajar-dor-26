import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!mongoUri) {
throw new Error("MONGODB_URI is missing");
}

if (!authSecret) {
throw new Error("BETTER_AUTH_SECRET is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
mongoClient?: MongoClient;
mongoClientPromise?: Promise<MongoClient>;
};

const client =
globalForMongo.mongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
globalForMongo.mongoClient = client;
}

const clientPromise =
globalForMongo.mongoClientPromise ??
client.connect().then(() => client);

if (process.env.NODE_ENV !== "production") {
globalForMongo.mongoClientPromise = clientPromise;
}

const db = client.db("bazardor");

export const auth = betterAuth({
appName: "BazarDor",

baseURL:
process.env.BETTER_AUTH_URL || "http://localhost:3000",

secret: authSecret,

trustedOrigins: [
"http://localhost:3000",
"http://127.0.0.1:3000",
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

socialProviders: {
google: {
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
},


github: {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
},


},

account: {
accountLinking: {
enabled: true,
trustedProviders: ["google", "github"],
},
},
});
