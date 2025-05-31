const Task = require("../models/tasks");
const User = require("../models/user");

const addTask = async (req, res) => {
  // console.log("api")
  //  return

  try {
    const { title, description, priority, status } = req.body;
    const user = req.user;

    if (!title || !description) {
      return res.status(400).json({ error: "All fields are required ." });
    }
    if (title.length < 6) {
      return res.status(400).json({ error: "Title must have 6 characters ." });
    }
    if (description.length < 6) {
      return res
        .status(400)
        .json({ error: "description must have 6 characters ." });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      // Assuming tasks are associated with a user
    });
    await new Task({ title, description, priority, status })
  .save()
  .then(task =>
    User.findByIdAndUpdate(req.user._id, { $push: { tasks: task._id } })
  );
    return res.status(200).json({ success: "Task added." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "internal server error !" });
  }
};

//edit task
const editTask = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { title, description, priority, status } = req.body;


    // const {user} = req;

    if (!title || !description) {
      return res.status(400).json({ error: "All fields are required ." });
    }
    if (title.length < 6) {
      return res.status(400).json({ error: "Title must have 6 characters ." });
    }
    if (description.length < 6) {
      return res
        .status(400)
        .json({ error: "description must have 6 characters ." });
    }

    // const newTask = newTask({ title, description, priority, status });
    // await newTask.save();
    // User.tasks.push(newTask._id);
    // await User.save();
    await Task.findByIdAndUpdate(id, { title, description, priority, status });
    return res.status(200).json({ success: "Task updated." });
  } catch (error) {
    return res.status(400).json({ error: "internal server error !" });
  }
};

//get one task

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskDetails = await Task.findById(id);
    // await Task.findByIdAndUpdate(id, { title, description, priority, status });
    return res.status(200).json({ taskDetails });
  } catch (error) {
    return res.status(400).json({ error: "internal server error !" });
  }
};

//delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ success: "Task deleted." });
  } catch (error) {
    return res.status(400).json({ error: "internal server error !" });
  }
};

module.exports = { addTask, editTask, getTask, deleteTask };
