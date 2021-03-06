const express = require('express');
const path = require('path');

const app = express();
const port = 9090;

app.use(express.static(path.join(__dirname, '/')));
app.get('/', (req, res) => res.sendFile(__dirname + 'index.html'));

app.listen(port, () => console.log(`Express server connected to port ${port}`));