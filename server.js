/**
 * @fileoverview Main server file for the Cost Manager RESTful Web Services
 * @requires express
 * @requires body-parser
 * @requires ./config/db
 * @requires dotenv
 */

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/Db');
const dotenv = require('dotenv');
const path = require('path');

/**
 * @description Import models to ensure they are registered with Mongoose
 * @requires ./models/User
 * @requires ./models/Cost
 */
require('./models/User');
require('./models/Cost');

dotenv.config();
connectDB();

/**
 * @description Initialize Express application
 * @type {express.Application}
 */
const app = express();

/**
 * @description Configure middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @description Define API routes
 */
app.use('/api', require('./routes/userRouter'));

/**
 * @description Serve API documentation
 */
app.use('/docs', express.static(path.join(__dirname, 'docs')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
