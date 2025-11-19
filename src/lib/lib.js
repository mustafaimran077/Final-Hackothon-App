


import mongoose from "mongoose";

let isConnected = false; // Cache connection

 const connectDB = async () => {
  if (isConnected) return; // Use cached connection

  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)

    isConnected = true;
    console.log(`Database Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    // No process.exit in serverless — just throw
    throw new Error(error);
  }
};
export default connectDB