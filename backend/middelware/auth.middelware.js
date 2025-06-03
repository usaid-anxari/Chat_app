import jwt from "jsonwebtoken";
import User from "../model/User.model.js";



// ---- Middelware 
export const protectRoute = async (req, res, next) =>{
    try {
        const token = req.header.token;
        const decoded = jwt.verify(token,process.env.SECRET_KEY)

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}