import User from "../models/user.model.js";
import cloudinary from "../services/cloudinary.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  //   validate request body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    // check if user password is less than 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    // check if user already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, Please login!",
      });
    }
    // create new user
    const newUser = new User({
      name,
      email,
      password,
    });
    // save and generate token
    await newUser.save();
    const token = newUser.generateToken();
    // set cookie as HTTP only
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // send sucess response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
      jwtToken: token,
    });
  } catch (error) {
    console.log(`Error while registering user: ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `Error while registering user: ${error.message}`,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //   validate request body
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, Please register!",
      });
    }
    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials, Please try again!",
      });
    }
    // generate token
    const token = user.generateToken();
    // set cookie as HTTP only
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // send sucess response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
      jwtToken: token,
    });
  } catch (error) {
    console.log(`Error while logging in user: ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `Error while logging in user: ${error.message}`,
    });
  }
};

export const logoutUser = async (req, res) => {
  // check for session
  if (!req.cookies?.jwtToken) {
    return res.status(400).json({
      success: false,
      message: "No active session found",
    });
  }
  // clear cookie
  res.clearCookie("jwtToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    // validate request body
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Please provide profile picture" });
    }
    // check if user authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, Please login!",
      });
    }
    const userId = req.user._id;
    const uploadResult = await cloudinary.uploader.upload(profilePic);
    // check if upload was successful
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed, Please try again!",
      });
    }
    // update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );
    // send success response
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (error) {
    console.log(`Error while updating user profile: ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `Error while updating user profile: ${error.message}`,
    });
  }
};

export const checkAuthenticated = (req, res) => {
  try {
    // check if user authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, Please login!",
      });
    }
    // send success response
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePic: req.user.profilePic,
      },
    });
  } catch (error) {
    console.log(`Error while checking authentication: ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `Error while checking authentication: ${error.message}`,
    });
  }
};
