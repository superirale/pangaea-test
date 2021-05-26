"use strict";
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
let router = require('./router');


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

app.use('/', router);

app.listen(process.env.APP_PORT);

if(process.env.NODE_ENV == 'test') {
    module.export =  app; // for testing
}
