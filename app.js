// app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authentication');
const passwordResetRoutes = require('./routes/passwordReset');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();

// CORS Middleware
app.use(cors()); // Enable CORS for all routes

mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log('MongoDB Connected!') })
    .catch(() => { console.log('Failed to connect to MongoDB') });

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
