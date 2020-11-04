require('./db');

//------------------------------------ Declarations
const express = require('express');
const bodyParser = require('body-express');
const cors = require('cors');
const passport = require('passport');

var app = express();

//------------------------------------ Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
