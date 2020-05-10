const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post(
  "/",
  [
    //make sure the name field is not empty
    check("name", "Please add name").not().isEmpty(),
    //make sure the email is valid
    check("email", "Please include a valid email").isEmail(),
    //password must be at least 6 and at most 36 chars long
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6, max: 36 }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name: name,
        email: email,
        password: password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
