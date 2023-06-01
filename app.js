// Libs
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { JsonDB, Config } from 'node-json-db';
import dotenv from 'dotenv';

// Config
const app = express();
const port = process.env.PORT || 8000;
const db = new JsonDB(new Config("db", true, true, '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

// Routers
import appRoutes from './routes/appRoutes.js';

// Static files
app.use(express.static('public'));

// Routes
app.use(appRoutes);

// Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});