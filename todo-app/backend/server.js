require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma/index.js");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("dev.db");
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = await prisma.task.create({
    data: { title: title.trim() }
  });
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
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

  try {
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
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: parseInt(id) }
  });
  res.send("Deleted");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
