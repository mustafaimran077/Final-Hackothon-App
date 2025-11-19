import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    userName: {
        type: "String",
        unique: true,
        required: true
    },
    email: {
        type: "String",
        unique: true,
        required: true
    },

    password: {
        type: "String",
        unique: true,
        minlenght: 6
    },

    profileImage: {
        type: "String",
        default: ""
    }

},{timestamps:true});



const User = mongoose.model("User", UserSchema);

export default User;