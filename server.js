require("dotenv").config();
require("./config/database");
const express = require("express");
const path = require("path");

// backend app
const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/orders", require("./routes/api/orders"));
app.use("/api/fruits", require("./routes/api/fruits"));
app.get("/api", (req, res) => {
    res.json({ msg: "Hello World!"})
})

// listen
const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Express app running on port ${port}`)
});