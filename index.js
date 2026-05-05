const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect("mongodb://127.0.0.1:27017/taskdb")
.then(()=>console.log("DB Connected"))
.catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: String, required: true },
  status: { type: String, default: "Pending" }
});

const Task = mongoose.model("Task", taskSchema);

// Signup
app.post("/signup", async (req,res)=>{
  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if(existing) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    res.send("User created successfully");

  } catch(err){
    res.status(500).send("Error: " + err.message);
  }
});

// Login
app.post("/login", async (req,res)=>{
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).send("Wrong password");

    res.send(user);

  } catch(err){
    res.status(500).send("Error: " + err.message);
  }
});

// Create Task
app.post("/task", async (req,res)=>{
  try {
    const task = new Task(req.body);
    await task.save();
    res.send("Task created successfully");
  } catch(err){
    res.status(500).send(err.message);
  }
});

// Get All Tasks
app.get("/tasks", async (req,res)=>{
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch(err){
    res.status(500).send(err.message);
  }
});

// Update Task Status
app.put("/task/:id", async (req,res)=>{
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.send("Task updated");
  } catch(err){
    res.status(500).send(err.message);
  }
});

// Delete Task
app.delete("/task/:id", async (req,res)=>{
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Task deleted");
  } catch(err){
    res.status(500).send(err.message);
  }
});

app.listen(5000, ()=>console.log("Server running on 5000"));