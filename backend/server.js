const path = require("path");
const dotenv = require("dotenv");

// Load env vars FIRST
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const activityRoutes = require('./routes/activityRoutes');
const { protect, authorize } = require('./middleware/auth');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// serve uploads statically (already implemented? ensure path is correct)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// use activities route
app.use('/api/activities', activityRoutes);

// Enable CORS - MUST BE FIRST
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const childRoutes = require('./routes/childRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffDailyUpdateRoutes = require('./routes/staffDailyUpdateRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/daily-updates', dailyUpdateRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Smart Daycare Management API is running!',
    version: '1.0.0',
    project: 'Smart Daycare Management and Parent Monitoring System',
    availableEndpoints: {
      auth: '/api/auth',
      children: '/api/children'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: err.message
  });
});


// Configure multer to store files in the uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists or use fs to create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename to avoid duplicates
  },
});

const upload = multer({ storage: storage });

router.post("/daily-updates", upload.array("files"), async (req, res) => {
  const { attendance, napStart, napEnd, meal, behaviorNotes } = req.body;

  try {
    const updateData = {
      attendance,
      napStart,
      napEnd,
      meal,
      behaviorNotes,
      files: req.files.map((file) => file.path), // Store file paths in the DB
    };

    // Save to database (assuming you're using a model called `DailyUpdate`)
    const newUpdate = new DailyUpdate(updateData);
    await newUpdate.save();

    res.status(200).json({
      success: true,
      message: "Daily updates saved successfully!",
      data: newUpdate,
    });
  } catch (error) {
    console.error("Error saving daily update:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('================================');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);

  console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   - Children: http://localhost:${PORT}/api/children`);
  console.log('================================');
});