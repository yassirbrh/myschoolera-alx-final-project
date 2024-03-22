const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
    res.send("Home Page !!\n");
})

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => console.log(error))
