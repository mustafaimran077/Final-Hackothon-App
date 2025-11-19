import express from "express";
import cors from "cors";

import authRoutes from "./Routes/authRoute.js";
import bookRoutes from "./Routes/bookRoute.js";
import appoinmentRoute from "./Routes/appoinmentRoute.js";
import medicalRecordRoutes from "./Routes/medicallRecordRoute.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
import profileRoute from "./Routes/profileRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/appoinment", appoinmentRoute);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", profileRoute);

export default app;
