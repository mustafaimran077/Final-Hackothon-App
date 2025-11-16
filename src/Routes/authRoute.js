
import express from "express";
import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();

const generateToken = (userId) => { return jwt.sign({ userId }, process.env.MY_SECRET_KEY, { expiresIn: "7d" }) };




router.post("/register", async (req, res) => {

    try {

        const { email, password, userName } = req.body;

        if (!email || !password || !userName) {
            return res.status(400).json({ message: "All Fields Are Required" })
        };

        if (password.length < 6) {
            return res.status(400).json({ message: "Password Shoule be Atleast 6 Characters Long" })
        };

        if (userName.length < 3) {
            return res.status(400).json({ message: "UserName Shoule be Atleast 3 Characters Long" })
        };

        // Check User Already Exists

        const existingUseremail = await User.findOne({ email });

        if (existingUseremail) return res.status(400).json({ message: " Email Already Exists" });

        const existingUsername = await User.findOne({ userName });

        if (existingUsername) return res.status(400).json({ message: "UserName Already Exists" });

        // Hash The Password

        const hashedPassword = await bcrypt.hash(password, 10);

        // Get Avator 

        const profileImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=${userName}`;


        const user = new User({
            email,
            password: hashedPassword,
            profileImage,
            userName
        });

        await user.save();

        const token = generateToken(user._id)

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.userName,
                email: user.email,
                profileImage: user.profileImage
            }
        })

    } catch (error) {

        console.log("Error in Register Api", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

router.post("/login", async (req, res) => {

    try {


        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All Fields Are Required" })
        };

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const checkPassword = await bcrypt.compare(password,user.password)

        if(!checkPassword)  return res.status(400).json({ message: "Invalid Credentials" });

               const token = generateToken(user._id);

        // 5️⃣ Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.userName,
                email: user.email,
                profileImage: user.profileImage,
            },
        });

    } catch (error) {

         console.log("Error in Login Api", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });

    }
});


export default router;