require("dotenv").config({ path: ".env.production" });
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await prisma.task.create({
      data: { title: title.trim() }
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const data = {};
    if (typeof title === "string" && title.trim()) {
      data.title = title.trim();
    }
    if (typeof completed === "boolean") {
      data.completed = completed;
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id, 10) },
      data
    });
    return res.json(updatedTask);
  } catch (error) {
    return res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Task not found" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});