const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @description Register a new user, expects userName and pass in req.body
 * @access Public
 */
async function registerUserController(req, res) {
  const { email, username, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide email, username and password",
    });
  }
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isUserAlreadyExists) {
    if (isUserAlreadyExists.username == username) {
      return res.status(400).json({
        message: "Account with username already exists",
      });
    } else if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "Account with email already exists",
      });
    }
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(201).json({
    message: "User registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @route POST /api/auth/login
 * @description Login a user, expects email and pass in req.body
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "User does not exist with this email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "User does not exist with this email or password" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "User logged in Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutUserController
 * @route POST /api/auth/logout
 * @description Logout a user, clears the token cookie and adds it to tokenBlacklist
 * @access Public
 */

module.exports = { registerUserController, loginUserController };
