import express from "express";
import Doctor from "../Models/doctorSchema.js";
import { protectedRoute } from "../Middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   📌 GET ALL DOCTORS
--------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Doctors", error: error.message });
  }
});

/* ------------------------------------------
   📌 GET DOCTOR BY ID
--------------------------------------------*/
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor Not Found" });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Doctor", error: error.message });
  }
});

/* ------------------------------------------
   📌 ADD DOCTOR
--------------------------------------------*/
router.post("/", protectedRoute, async (req, res) => {
  try {
    const { name, specialization, experience, fees, availableDays, timeSlots, profileImage, description } = req.body;

    if (!name || !specialization || !experience || !fees) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const doctor = new Doctor({
      name, specialization, experience, fees, availableDays, timeSlots, profileImage, description
    });

    await doctor.save();
    res.status(200).json({ message: "Doctor Added", doctor });

  } catch (error) {
    res.status(500).json({ message: "Error Adding Doctor", error: error.message });
  }
});

/* ------------------------------------------
   📌 UPDATE DOCTOR
--------------------------------------------*/
router.put("/:id", protectedRoute, async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Doctor Updated", doctor: updated });
  } catch (error) {
    res.status(500).json({ message: "Error Updating Doctor", error: error.message });
  }
});

/* ------------------------------------------
   📌 DELETE DOCTOR
--------------------------------------------*/
router.delete("/:id", protectedRoute, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Doctor Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Doctor", error: error.message });
  }
});

export default router;
