const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send(`You've landed on root path`);
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});