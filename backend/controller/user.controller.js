import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import { generatetoken } from "../utils/generateToken.js";
import cloudinary from '../utils/cloudinary.js'

// ----- Signup Route

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generatetoken(newUser._id);
    res.status(201).json({
      success: true,
      token,
      userData: newUser,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// ----- Login Route
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const userData = await User.findOne({ email });
    const isPasswordCorrect = bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = generatetoken(userData._id);
    res.status(200).json({
      success: true,
      token,
      userData,
      message: "Logged in Successfully",
    });
    res
      .status(200)
      .json({ success: true, token, message: "Logged In Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// ----- Controller to check user authentication
export const checkAuth = (req,res)=>  {
    res,json({success:true,user:req.user})
} 

// ----- Update Profile

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic,bio,fullName} = req.body;
        const userId = req.user._id;
        let updatedUser ;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate({bio,fullName},{new:true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
        }
        res
        .status(200)
        .json({ success: true, user:updateProfile, message: "Profile Updated Successfully" });
    } catch (error) {
        console.log(error);
        res
      .status(500)
      .json({ success: false, message:error.message });
        
    }
}