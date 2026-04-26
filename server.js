const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("Server running"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Load scripts
function getScripts() {
  if (!fs.existsSync("scripts.json")) return [];
  return JSON.parse(fs.readFileSync("scripts.json"));
}

// Save scripts
function saveScripts(data) {
  fs.writeFileSync("scripts.json", JSON.stringify(data, null, 2));
}

// Roblox avatar API
app.get("/avatar/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${req.params.id}&size=150x150&format=Png`
    );
    const data = await response.json();

    res.json({ url: data.data[0].imageUrl });
  } catch {
    res.json({ error: "Failed" });
  }
});

// Get scripts
app.get("/scripts", (req, res) => {
  res.json(getScripts());
});

// Add script
app.post("/add-script", (req, res) => {
  const scripts = getScripts();
  scripts.push(req.body);
  saveScripts(scripts);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
