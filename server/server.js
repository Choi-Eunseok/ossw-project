const express = require('express');
const app = express();
const test = require('.//Router/test');

app.use('/', test);

const port=23023;
app.listen(port, ()=>{console.log(`Listening on port ${port}`)});