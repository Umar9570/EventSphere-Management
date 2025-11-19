const express = require('express');
const ConnectDB = require('./config/db');
const app = express();
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())
ConnectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})


