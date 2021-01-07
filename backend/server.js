const express = require("express");
const { body } = require("express-validator");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const app = express();

// this is for connecting to the database
connectDB();
//middle ware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/login", require("./routes/api/login"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server started on port " + PORT));
