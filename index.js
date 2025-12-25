const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const SOURCE_API = "https://metakexbyneokex.fly.dev/animate";
const TIMEOUT = 90000;

let requestCount = 0;

async function fetchVideo(prompt) {
  const url = `${SOURCE_API}?prompt=${encodeURIComponent(prompt)}`;
  const r = await axios.get(url, { timeout: TIMEOUT });
  if (!r.data || !r.data.success) return null;
  return r.data.video_urls?.[0] || null;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/animate", async (req, res) => {
  const prompt = req.query.prompt;
  requestCount++;

  console.log(
    `[${new Date().toLocaleString()}] Request #${requestCount} | Prompt: ${prompt || "EMPTY"}`
  );

  if (!prompt) return res.json({ success: false });

  try {
    let video = await fetchVideo(prompt);
    if (!video) video = await fetchVideo(prompt);
    if (!video) throw 0;

    res.json({ success: true, video });
  } catch {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log("SAHU API Running.....");
});
