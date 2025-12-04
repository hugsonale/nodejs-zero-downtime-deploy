const express = require('express');
const app = express();
const PORT = 3000;

const version = "v2";


app.get('/', (req, res) => {
  res.send(`Hello from Node.js app! Version: ${version}`);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}, version ${version}`);
});
