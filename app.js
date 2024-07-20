const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const foodLogRoutes = require('./src/routes/foodLogRoutes')


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//connect to mongodb
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

const foodRoutes = require('./src/routes/foodRoutes');
// const userRoutes = require('./routes/userRoutes');
// const logRoutes = require('./routes/logRoutes');

const userRoutes = require('./src/routes/userRoutes')


app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);  // Debug log
  next();
});


//routes
app.use('/api/foods', foodRoutes);
app.use('/api/foodlogs', foodLogRoutes);
app.use('/api/users',userRoutes);








app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
