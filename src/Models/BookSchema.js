import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({

    title: {
        type: "String",
        required: true
    },
    caption: {
        type: "String",
        required: true
    },

    rating:{
        type:"String",
        min:1,
        max:5
    },

    image: {
        type: "String",
        required: true
    },
    
  imagePublicId: {          
    type: String,
    required: true,
  },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    }

}, { timestamps: true });



const BookModule = mongoose.model("Book", BookSchema);

export default BookModule;