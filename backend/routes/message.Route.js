import express from "express";
import { protectRoute } from "../middelware/auth.middelware.js";
import {
  getMessage,
  getUserForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controller/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get("/user", protectRoute, getUserForSidebar);
messageRoutes.get("/:id", protectRoute, getMessage);
messageRoutes.put("mark/:id", protectRoute, markMessageAsSeen);
messageRoutes.post("/send/:id",protectRoute,sendMessage)

export default messageRoutes; //export the routes to use in other files
