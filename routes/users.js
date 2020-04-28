const express = require("express");
const router = express.Router();

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", (req, res) => {
  res.json({ msg: "This is a POST api/users" });
});

module.exports = router;
