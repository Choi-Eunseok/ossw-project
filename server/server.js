const express = require('express');
const app = express();
const api = require('./Router/api');

app.use('/', api);

const port = 23023;
app.listen(port, () => { console.log(`Listening on port ${port}`) });