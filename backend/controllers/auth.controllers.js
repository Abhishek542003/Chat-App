import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const signup = async (req, res) => {
  console.log("Received signup request");
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords didn't match" });
      return;
    }

    const user = await User.findOne({ username });

    if (user) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    // HASH PASSWORD HERE (use bcrypt or another secure method)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password:hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });


    if (newUser)
    {

      // Generate JWT Token Here 
      generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic,
        });

    }
    else
    {
      res.status(400).json({ error: "Invalid user data" });
     }
    
  }
  catch (error)
  {
    console.log("Error in Signup Controller ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) =>
{
  try
  {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect)
    {
      return res.status(400).json({ error: "Invalid Username or Password" });
    }
    generateTokenAndSetCookie(user._id, res);
     res.status(201).json({
       _id: user._id,
       fullName: user.fullName,
       profilePic: user.profilePic,
     });

  }
  catch (error)
  {
    console.log("Error in Login Controller ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
 
  try
  {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({message:"Logout Successfully"})
  }
  catch (error)
  {
    console.log("Error in Logout Controller ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
