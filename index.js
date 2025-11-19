import express from "express";
import cors from "cors";

import authRoutes from "./Routes/authRoute.js";
import appoinmentRoute from "./Routes/appoinmentRoute.js";
import medicalRecordRoutes from "./Routes/medicallRecordRoute.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
import profileRoute from "./Routes/profileRoute.js";

import connectDB from "./lib/lib.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/appoinment", appoinmentRoute);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", profileRoute);

app.get("/", (req, res) => {
  res.json({ message: "Server started" });
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to DB:", err.message));


