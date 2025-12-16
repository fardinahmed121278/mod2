const User = require('../models/User');
const Child = require('../models/Child');
const Activity = require('../models/Activity');

// @desc    Admin stats summary
// @route   GET /api/admin/stats
// @access  Private (admin)
exports.getStats = async (req, res) => {
  try {
    const [children, staff, activities] = await Promise.all([
      Child.countDocuments({}),
      User.countDocuments({ role: 'staff' }),
      Activity.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: { children, staff, activities }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
};
