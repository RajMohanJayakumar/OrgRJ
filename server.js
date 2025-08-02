const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files from the current directory
app.use(express.static('.'));

// Handle SPA routing - serve index.html for all non-file routes
app.get('*', (req, res) => {
  // Check if the request is for a file (has an extension)
  if (path.extname(req.path)) {
    // If it's a file request and we get here, it means the file doesn't exist
    res.status(404).send('File not found');
  } else {
    // For all other routes (SPA routes), serve index.html
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('SPA routing enabled - all routes will serve index.html');
});
