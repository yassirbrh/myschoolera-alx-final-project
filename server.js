const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/errorMiddleware');
const authAdminProtect = require('./middlewares/authAdminMiddleware');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const studentRoute = require('./routes/studentRoute');
const teacherRoute = require('./routes/teacherRoute');
const adminRoute = require('./routes/adminRoute');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));

app.use("/api/users", userRoute);
app.use("/api/students", studentRoute);
app.use("/api/teachers", teacherRoute);
app.use("/api/admin", adminRoute);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/views/admin.html');
});

app.get('/AdminDashboard', authAdminProtect, (req, res) => {
    res.sendFile(__dirname + '/views/admin_dashboard.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/views/dashboard/index.html');
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => console.log(error))
