const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./db/connect.js')
const messagesRouter = require('./routes/messagesRouter.js')

dotenv.config();
const app = express();

const initApp = async () => {
  await dbConnect();
};

initApp();

app.use(express.json());

app.use('/message', messagesRouter)

module.exports = app