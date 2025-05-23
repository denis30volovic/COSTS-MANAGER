/**
 * @fileoverview Main server file for the Cost Manager RESTful Web Services
 * @requires express
 * @requires body-parser
 * @requires ./config/db
 * @requires dotenv
 */

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());

/**
 * @description Define API routes
 */
app.use('/api', require('./routes/userRouter'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));