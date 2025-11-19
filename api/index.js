import app from "../src/server.js";
import connectDB from "../src/lib/lib.js";

export default async function handler(req, res) {
  await connectDB();     // Safe for Serverless
  return app(req, res);  // Pass request to Express
}
