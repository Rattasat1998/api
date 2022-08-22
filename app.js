require("dotenv").config();
require("./config/database").connect();
const express = require("express");

var bodyParser = require('body-parser')
const app = express();
var router = require('./routes/app_router');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json({ limit: "50mb" }));
app.use('/api', router);


module.exports = app;