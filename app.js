const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const messagesRouter = require('./routes/messagesRouter.js')

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use('/message', messagesRouter)

module.exports = app