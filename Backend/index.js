const express = require('express');
const ConnectDB = require('./config/db');
const app = express();
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())
ConnectDB();

app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/expos", require("./routes/ExpoRoutes"));
app.use("/api/exhibitors", require("./routes/ExhibitorRoutes"));
app.use("/api/attendees", require("./routes/AttendeeRoutes"));
app.use("/api/schedule", require("./routes/ScheduleRoutes"));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})


