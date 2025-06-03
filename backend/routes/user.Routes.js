import express from "express"
import {signup,login, updateProfile, checkAuth} from '../controller/user.controller.js';
import { protectRoute } from "../middelware/auth.middelware.js";

const userRouter = express.Router()
userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.put('/update-profile',protectRoute ,updateProfile)
userRouter.put('/check-profile',protectRoute ,checkAuth)

export default userRouter;