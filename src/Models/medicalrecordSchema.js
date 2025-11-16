import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ["Prescription", "Lab Report", "X-ray", "Other"], default: "Other" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    date: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
