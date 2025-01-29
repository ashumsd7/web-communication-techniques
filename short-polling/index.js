const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to get data
app.get("/getData", (req, res) => {
  // This endpoint can be accessed at: http://localhost:3000/getData
  console.log("getData called");
  const now = new Date();
  res.send(`Polling after 5 seconds:  ${now.toLocaleTimeString()}`);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
