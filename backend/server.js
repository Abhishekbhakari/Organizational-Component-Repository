const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

//env variables
dotenv.config();

// Connect Database
connectDB();

//Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/components', require('./routes/componentRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
