import express from "express";
import cloudinary from "../lib/cloudinary.js";
import BookModule from "../Models/BookSchema.js";
import { protectedRoute } from "../Middleware/authMiddleware.js";


const router = express.Router();

// Create Book Api

router.post("/", protectedRoute, async (req, res) => {

    try {

        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {

            return res.status(400).json({ message: "All Fields Are Required" })

        }

        const uploadImage = await cloudinary.uploader.upload(image);

        const image_Url = uploadImage.secure_url;

        const Book = new BookModule({
            title,
            image: image_Url,
            rating,
            imagePublicId: uploadImage.public_id,
            user: req.user._id

        })

        await Book.save();

        res.status(201).json({ message: "Book added successfully", Book });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message


        })



    }
}
);


// Limit  Api

router.get("/", protectedRoute, async (req, res) => {
    try {

        const limit = req.query.limit || 5
        const page = req.query.page || 1
        const skip = (page - 1) * limit
        const Books = await BookModule.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate("user", "userName profileImage")

        const totalBooks = await BookModule.countDocuments();
        res.send({

            Books,
            totalPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })

    }
});

// Delete Api

router.delete("/:id", protectedRoute, async (req, res) => {
    try {
        const book = await BookModule.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!book) return res.status(404).json({ message: "Book not found or unauthorized" });

        // delete image 

        if (book.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(book.imagePublicId);
            } catch (error) {
                console.log("Error deleting image from Cloudinary:", error);
            }
        }


        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get User Book  Api

router.get("/user", protectedRoute, async (req, res) => {
    try {
        const allBooks = await BookModule.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(allBooks)
    } catch (error) {
        console.log("Get User Book Error");
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })

    }
});


export default router