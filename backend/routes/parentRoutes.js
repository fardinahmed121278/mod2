// GET route for parents to fetch daily updates for their children
router.get("/updates", protect, authorize("parent"), async (req, res) => {
  try {
    // Get the parent ID from the user object (req.user)
    const updates = await StaffDailyUpdate.find({
      child: { $in: req.user.children }, // Ensure the updates belong to the parent's children
    }).populate("child"); // Populate child info
    res.status(200).json({ success: true, data: updates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch updates" });
  }
});
