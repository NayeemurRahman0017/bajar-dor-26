import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  const uri = process.env.MONGODB_URL;

  if (!uri) {
    console.error("MONGODB_URL is missing from .env");
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection successful!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

testConnection();
