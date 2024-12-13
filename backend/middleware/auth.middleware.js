// ~this file is a middleware file to verify the token
import jwt from "jsonwebtoken"
import User from './../models/user.model.js';


export const protectRoute = async(req , res , next) =>{
    try{
        const token = req.cookies["jwt-linkedin"];
        // we have to check
        if(!token){
            return res.status(401).json({
                msg : "Unauthorized - No token Provided"
            });
        }

        // if token exists then we will verify it
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({
                msg : "Unauthorized - Invalid toke"
            });
        }

        // verified then we will set teh user id
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({
                msg : "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
		console.log("Error in protectRoute middleware:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}