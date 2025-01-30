const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the index page
app.get("/", (req, res) => {
  console.log("📄 Serving index.html page");
  res.sendFile(path.join(__dirname, "index.html"));
});

// Initial data value
let data = "2013 Congress Government";

// Array to store waiting client connections
const waitingClientList = [];

/**
 * Long polling endpoint to get data
 * Clients connect and wait for data changes
 */
app.get("/getData", (req, res) => {
  console.log("\n🔄 GET /getData");
  console.log("📱 Client's last known data:", req.query.lastData);
  console.log("💾 Current server data:", data);

  // If data has changed since client's last request
  if (data !== req.query.lastData) {
    console.log("✨ Data changed - sending new data to client");
    res.send(data);
  } else {
    // If no change, hold the connection
    console.log("⏳ No data change - adding client to waiting list");
    waitingClientList.push(res);
    console.log("👥 Current waiting clients:", waitingClientList.length);
  }
});

/**
 * Endpoint to update data and notify waiting clients
 * Query param: newData - The new data value to set
 */
app.get("/updateData", (req, res) => {
  console.log("\n🔄 GET /updateData");
  const newData = req.query.newData;
  
  console.log("📝 Old data:", data);
  console.log("✨ New data:", newData);
  
  // Update the data
  data = newData;

  // Notify all waiting clients
  console.log(`📢 Notifying ${waitingClientList.length} waiting clients`);
  waitingClientList.forEach(client => {
    client.send(data);
  });

  // Clear the waiting list
  waitingClientList.length = 0;
  console.log("🧹 Waiting list cleared");

  res.send("Data updated successfully");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log("\n🚀 Server is running on port", PORT);
  console.log("🌐 Long polling demo available at http://localhost:" + PORT);
});
