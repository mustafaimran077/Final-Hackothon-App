import express from "express";
import Appointment from "../Models/appoinmentSchema.js";
import { protectedRoute } from "../Middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   📌 BOOK APPOINTMENT
--------------------------------------------*/
router.post("/book", protectedRoute, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      userId: req.user._id,
      doctorId,
      date,
      time,
      status: "Confirmed"
    });

    await appointment.save();

    res.status(200).json({
      message: "Appointment Booked Successfully",
      appointment
    });

  } catch (error) {
    console.log("Book Appointment Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ------------------------------------------
   📌 GET MY APPOINTMENTS (All)
--------------------------------------------*/
router.get("/my-appointments", protectedRoute, async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ userId: req.user._id })
      .populate("doctorId", "name specialization");

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({ message: "Error Fetching Appointments", error: error.message });
  }
});

/* ------------------------------------------
   📌 UPCOMING APPOINTMENTS
--------------------------------------------*/
router.get("/upcoming", protectedRoute, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const upcoming = await Appointment
      .find({
        userId: req.user._id,
        date: { $gte: today },
        status: { $ne: "Cancelled" }
      })
      .sort({ date: 1 });

    res.status(200).json(upcoming);

  } catch (error) {
    res.status(500).json({ message: "Error Fetching Appointments", error: error.message });
  }
});

/* ------------------------------------------
   📌 HISTORY APPOINTMENTS
--------------------------------------------*/
router.get("/history", protectedRoute, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const history = await Appointment
      .find({
        userId: req.user._id,
        date: { $lt: today }
      })
      .sort({ date: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({ message: "Error Fetching History", error: error.message });
  }
});

/* ------------------------------------------
   📌 CANCEL APPOINTMENT
--------------------------------------------*/
router.put("/cancel/:id", protectedRoute, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment Not Found" });

    if (appointment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not Authorized!" });

    appointment.status = "Cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment Cancelled", appointment });

  } catch (error) {
    res.status(500).json({ message: "Error Cancelling", error: error.message });
  }
});

/* ------------------------------------------
   📌 CHANGE STATUS (Doctor/Admin)
--------------------------------------------*/
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status))
      return res.status(400).json({ message: "Invalid Status" });

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Status Updated", updated });

  } catch (error) {
    res.status(500).json({ message: "Error Updating Status", error: error.message });
  }
});

export default router;
