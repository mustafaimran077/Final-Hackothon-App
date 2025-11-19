// import jwt from "jsonwebtoken";
// import "dotenv/config";
// import User from "../Models/userSchema.js";

//  export const protectedRoute = async(req,res,next)=>{

//    try {
    
//      // get toeken

// const getToken = req.header("Authorization")?.replace("Bearer ", "").trim();

//      if(!getToken) return res.status(401).json({
//         message:"Token Not Found"
//      });

//     //  Verify Token

//     const decoded = jwt.verify(getToken,process.env.MY_SECRET_KEY);
//     console.log(decoded);
    

//     // Find User

//     const findUserbyToken = await User.findById(decoded.userId).select("-password")
//        if(!findUserbyToken) return res.status(401).json({
//         message:"Token is not Valid"
//      });

//      req.user = findUserbyToken;
//      next();

//    } catch (error) {
    
//     console.log(error.message);
//     res.status(500).json({
//         message:"Error in Token",
//           error : error.message 
//     })
    
//    }
// } 



import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../Models/userSchema.js";

export const protectedRoute = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Verify token
    const decoded = jwt.verify(token, process.env.MY_SECRET_KEY);

    // Find user from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    // Add user data to req object
    req.user = user;

    // Move to next middleware
    next();

  } catch (error) {
    console.log(error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }

    res.status(500).json({
      message: "Something went wrong in token verification",
      error: error.message
    });
  }
};
