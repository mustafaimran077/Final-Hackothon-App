import express from "express";
import User from "../Models/userSchema.js";
import { protectedRoute } from "../Middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   📌 GET PROFILE
--------------------------------------------*/
router.get("/profile", protectedRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Profile", error: error.message });
  }
});

/* ------------------------------------------
   📌 UPDATE PROFILE
--------------------------------------------*/
router.put("/update", protectedRoute, async (req, res) => {
  try {
    const { userName, email, phone, profileImage } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { userName, email, phone, profileImage },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile Updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Error Updating Profile", error: error.message });
  }
});

export default router;
