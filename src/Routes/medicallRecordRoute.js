import express from "express";
import MedicalRecord from "../Models/medicalrecordSchema.js";
import { protectedRoute } from "../Middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   📌 GET ALL RECORDS
--------------------------------------------*/
router.get("/", protectedRoute, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user._id }).populate("doctorId", "name specialization");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Records", error: error.message });
  }
});

/* ------------------------------------------
   📌 UPLOAD NEW RECORD
--------------------------------------------*/
router.post("/upload", protectedRoute, async (req, res) => {
  try {
    const { title, fileUrl, type, doctorId, date } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ message: "Title & File URL are required" });
    }

    const record = new MedicalRecord({
      userId: req.user._id,
      title,
      fileUrl,
      type,
      doctorId,
      date
    });

    await record.save();

    res.status(200).json({ message: "Record Uploaded Successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Error Uploading Record", error: error.message });
  }
});

export default router;
