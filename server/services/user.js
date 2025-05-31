const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tasks = require("../models/tasks");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required !" });
    }
    if (username.length < 5) {
      return res
        .status(400)
        .json({ error: "Username must have 5 charachters !" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password  must have 6 charachters !" });
    }
    const checkUser = await User.findOne({ $or: [{ email }, { username }] });
    if (checkUser) {
      return res
        .status(400)
        .json({ error: "Username and Email already exists !" });
    } else {
      const hashPass = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashPass });
      await newUser.save();
      return res.status(200).json({ success: "Registration successful !" });
    }
  } catch (error) {
    return res.status(404).json({ error: "Internal server error!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required !" });
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      bcrypt.compare(password, checkUser.password, (err, data) => {
        if (data) {
          const token = jwt.sign(
            { id: checkUser._id, email: checkUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );
          res.cookie("taskifyUserToken", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None",
          });
          return res.status(200).json({
            success: "Login Successful!",
            user: {
              id: checkUser._id,
              name: checkUser.name,
              email: checkUser.email,
            },
          });
        } else {
          return res.status(400).json({ error: "Invalid Credentials !" });
        }
      });
    } else {
      return res.status(400).json({ error: "Email does not exist !" });
    }
  } catch (error) {
    return res.status(404).json({ error: "Internal server error!" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("taskifyUserToken", {
      httpOnly: true,
    });
    res.json({ message: "Logged out" });
  } catch (error) {
    return res.status(404).json({ error: "Internal server error !" });
  }
};

const userDetails = async (req, res) => {
  try {
    const { user } = req;
    const getDetails = await User.findById(user._id)
      .populate("tasks")
      .select("-password");

    if(getDetails){
      const Tasks =getDetails.tasks;
      let yetToStart = [];
      let inProgress = [];
      let completed = [];
      Tasks.map((items)=>{
        if(items.status === "yetToStart"){
          yetToStart.push(items);
        }else if(items.status==="inProgress"){
          inProgress.push(items);
        }else{
          completed.push(items);
        }
      });
      // console.log(Tasks)
      return res.status(200).json({
        success:"success",
        tasks:[{ yetToStart },{ inProgress },{ completed }],
      });
    }
    // if (!getDetails) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found" });
    // }

    
    // const allTasks = getDetails.tasks;
    // const yetToStart = allTasks.filter((task) => task.status === "yetToStart");
    // const inProgress = allTasks.filter((task) => task.status === "inProgress");
    // const completed = allTasks.filter((task) => task.status === "completed");

    // return res.status(200).json({
    //   success: true,
    //   tasks: {
    //     yetToStart,
    //     inProgress,
    //     completed,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login, logout, userDetails };
