const express = require('express');
const app = express();
const api = require('./Router/api');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', api);

const port = 23023;
app.listen(port, () => { console.log(`Listening on port ${port}`) });