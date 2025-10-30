const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = "./data.json";

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle CRUD actions directly
app.post("/action", async (req, res) => {
  const { action, id, studentName, projectTitle, description, website } = req.body;

  try {
    let data = await fs.readJson(DATA_FILE);

    if (action === "add") {
      const newProject = {
        id: Date.now(),
        studentName,
        projectTitle,
        description,
        website,
      };
      data.push(newProject);
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
      return res.json({ message: "Project added", data });
    }

    if (action === "update") {
      const index = data.findIndex((p) => p.id == id);
      if (index === -1) return res.json({ error: "Project not found" });
      data[index] = { ...data[index], studentName, projectTitle, description, website };
      await fs.writeJson(DATA_FILE, data, { spaces: 2 });
      return res.json({ message: "Project updated", data });
    }

    if (action === "delete") {
      const newData = data.filter((p) => p.id != id);
      await fs.writeJson(DATA_FILE, newData, { spaces: 2 });
      return res.json({ message: "Project deleted", data: newData });
    }

    if (action === "get") {
      return res.json({ data });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File operation failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 Running at http://localhost:${PORT}`));
