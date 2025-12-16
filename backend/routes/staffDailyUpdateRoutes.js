const express = require('express');
const router = express.Router();
const DailyUpdate = require('../models/DailyUpdate');
const { protect, authorize } = require('../middleware/auth');

// POST: Log daily update for a child
router.post('/', protect, authorize('staff'), async (req, res) => {
  const { child, attendance, napStart, napEnd, meal, behaviorNotes, files } = req.body;

  try {
    const dailyUpdate = new DailyUpdate({
      child,
      staff: req.user.id,
      attendance,
      napStart,
      napEnd,
      meal,
      behaviorNotes,
      files
    });

    await dailyUpdate.save();
    res.status(201).json({ success: true, data: dailyUpdate });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Error logging daily update' });
  }
});

// GET: Fetch all daily updates for a specific child
router.get('/child/:childId', protect, async (req, res) => {
  try {
    const dailyUpdates = await DailyUpdate.find({ child: req.params.childId }).populate('staff');
    res.status(200).json({ success: true, data: dailyUpdates });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Error fetching daily updates' });
  }
});

module.exports = router;
