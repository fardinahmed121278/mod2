const express = require('express');
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const router = express.Router();

// Route: User requests to become admin
router.post('/request', async (req, res) => {
  const { userId } = req.body;

  try {
    // Ensure the user isn't already an admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'You are already an admin.' });
    }

    // Check if the user already has a pending request
    const existingRequest = await AdminRequest.findOne({ user: userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending request.' });
    }

    // Create a new admin request
    const newRequest = new AdminRequest({
      user: userId,
    });
    await newRequest.save();

    res.status(200).json({ success: true, message: 'Admin request submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Route: Super Admin can view all requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await AdminRequest.find().populate('user');  // Populate user details
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Route: Super Admin approves a request
router.put('/approve/:requestId', async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.requestId).populate('user');
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ error: 'Request not found or already processed.' });
    }

    // Update the request status
    request.status = 'approved';
    await request.save();

    // Upgrade the user's role to admin
    const user = request.user;
    user.role = 'admin'; // Change the role to admin
    await user.save();

    res.status(200).json({ success: true, message: 'User upgraded to admin.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Route: Super Admin rejects a request
router.put('/reject/:requestId', async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.requestId).populate('user');
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ error: 'Request not found or already processed.' });
    }

    // Update the request status to rejected
    request.status = 'rejected';
    await request.save();

    // Optionally, you could add logic to notify the user about the rejection if necessary

    res.status(200).json({ success: true, message: 'Admin request rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});
// GET route for admin to fetch all daily updates
router.get("/updates", protect, authorize("admin"), async (req, res) => {
  try {
    const updates = await StaffDailyUpdate.find().populate("child"); // Populate child info
    res.status(200).json({ success: true, data: updates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch updates" });
  }
});


module.exports = router;
