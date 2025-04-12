import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../services/cloudinary.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUser = await req.user._id;
    const filterdUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: filterdUsers,
    });
  } catch (error) {
    console.log(`Error while getting users: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages: messages,
    });
  } catch (error) {
    console.log(`Error while getting messages: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      message: newMessage,
    });
  } catch {
    console.log(`Error while sending message: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
