const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//env variables
dotenv.config();

// Connect Database
connectDB();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  // Multer Storage Configuration
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'component-images', // Create a folder for component images
      allowedFormats: ['jpg', 'png'],
    },
  });

  const upload = multer({ storage });

//Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: 'https://organizational-component-repository.vercel.app' 
}));

app.get('/', (req, res) => res.send('API Running'));

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
const componentRoutes = require('../routes/componentRoutes');
app.use('/api/components', upload.single('image'), componentRoutes);
app.use('/api/admin', require('../routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
