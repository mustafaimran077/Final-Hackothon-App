


import mongoose from "mongoose";



 const connectDB = async () => {
  

  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)

 
    console.log(`Database Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    // No process.exit in serverless — just throw
    throw new Error(error);
  }
};
export default connectDB