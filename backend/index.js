const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Root route (error fix)
app.get("/", (req, res) => {
  res.send("Task Manager Running 🚀");
});

// ✅ Temporary data (no database)
let tasks = [];

// Create Task
app.post("/task", (req,res)=>{
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  res.send(task);
});

// Get All Tasks
app.get("/tasks", (req,res)=>{
  res.send(tasks);
});

// Delete Task
app.delete("/task/:id", (req,res)=>{
  tasks = tasks.filter(t => t.id != req.params.id);
  res.send("Task deleted");
});

app.listen(PORT, ()=>console.log("Server running"));