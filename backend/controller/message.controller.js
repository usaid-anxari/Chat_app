import User from "../model/User.model.js";
import Messages from "../model/Messages.model.js";
import cloud from "../utils/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// ------ Get all users ------- //
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // unseen messages
    const unSeenMessages = {};
    const promise = filteredUsers.map(async (user) => {
      const message = await Messages.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (message.length > 0) {
        unSeenMessages[user._id] = message.length;
      }
    });
    await Promise.all(promise);
    res
      .status(200)
      .json({ success: true, user: filteredUsers, unSeenMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ------ Get all Messages for user ------- //

export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const message = await Messages.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Messages.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error " + error.message,
    });
  }
};

// --- Marking Message as Seen --- //
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Messages.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error " + error.message,
    });
  }
};

// ----- message Send ----- //
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.params._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloud.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Messages.create({
      text,
      image: imageUrl,
      senderId,
      receiverId,
    });

    // Update conversation
    const recevierSocketId = userSocketMap[receiverId];
    if (recevierSocketId) {
        io.to(recevierSocketId).emit("newMessage",newMessage)
    }

    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error " + error.message,
    });
  }
};
