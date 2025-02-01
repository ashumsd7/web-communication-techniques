const express = require('express');
const { join } = require('node:path');

const app = express();

// Serve static files from current directory
app.use(express.static(__dirname));

// Route for index page
app.get('/', (req, res) => {
  console.log('📄 Serving index.html page');
  res.sendFile(join(__dirname, 'index.html'));
});


app.get('/sse', (req, res) => {
 // data is going  to be long live 
  // data is going to be as event stream and no cache 
 res.setHeader('Content-Type','text/event-stream')
 res.setHeader('Connection', 'keep-alive')
 res.setHeader('Cache-Control', 'no-cache')
 // logic of data is going to be here : Database call 
 res.write('data: Hello, client! This is a test message.\n\n');

// after 5 seconds it will send random number 
const intervalId = setInterval(() => {
  res.write(`data: Random number: ${Math.floor(Math.random() * 100)}\n\n`);
 }, 5000);


 req.on('close', () => {
  console.log('Client disconnected');
  clearInterval(intervalId);
  res.end();
 });




});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('\n🚀 Server is running on port', PORT);
  console.log('🌐 Server-Sent Events demo available at http://localhost:' + PORT);
});
