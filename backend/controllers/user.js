import { USERS } from "../models/user.js";
import { generateToken } from "../config/generateToken.js";

export const handleUserSignup = async (req, res) => {
  const { username, email, password, pic } = req.body;
  if (!username || !email || !password) {
    try {
      throw new Error("Please enter all the fields");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  const user = await USERS.findOne({ email });
  if (user) {
    try {
      throw new Error("User already exists");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  try {
    const newUser = new USERS({ username, email, password, pic });
    await newUser.save();
    const token = generateToken(newUser._id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.status(201).cookie("access_token", token, options).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      pic: newUser.pic,
      token,
    });
  } catch (error) {
    try {
      throw new Error(error.message);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};

export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    try {
      throw new Error("Please enter all details");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // check whether user exist or not
  const user = await USERS.findOne({ email });
  if (!user) {
    try {
      throw new Error("User Does not exist");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  if (!(await user.matchPassword(password))) {
    try {
      throw new Error("Invalid Password");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  let token = generateToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(201).cookie("access_token", token, options).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    pic: user.pic,
    token,
  });
};

export const getAllUsers = async (req, res) => {
  // it generated all the keywords matching the query parameter in database
  const keyword = req.query.search
    ? {
        $or: [
          {
            username: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};

  // now we can extract data from databse in keywords
  //but here we don't want to get the user who is loggedin or who is searching for the AllUSERS
  const allUsers = await USERS.find(keyword)
    .find({
      _id: { $ne: req.user._id },
    })
    .select("-password");

  if (allUsers.length === 0) {
    try {
      throw new Error("No user found");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  res.send(allUsers);
};
