"use strict";
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const PORT = 3000;


const app = express();

// don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/listener1', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.post('/listener2', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});


app.listen(PORT);
console.log(`Running on ${PORT}`);
