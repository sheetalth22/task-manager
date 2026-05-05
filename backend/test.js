const axios = require("axios");

async function run(){
  await axios.post("http://localhost:5000/signup", {
    email: "test@gmail.com",
    password: "123",
    role: "admin"
  });

  await axios.post("http://localhost:5000/task", {
    title: "My First Task",
    assignedTo: "test@gmail.com",
    status: "pending"
  });

  console.log("Data Added");
}

run();