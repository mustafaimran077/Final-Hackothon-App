// import mongoose from "mongoose";


// export const connectDB = async () => {
//     try {
//         const connect = await mongoose.connect(process.env.MONGO_URI)
//         console.log(`Database Connected ${connect.connection.host}`);

//     } catch (error) {
//         console.log(error);
//         process.exit(1)

//     }
// };


import mongoose from "mongoose";

let isConnected = false; // Cache connection

export const connectDB = async () => {
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
