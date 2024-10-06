const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;

      const userExists = await Users.findOne({ email });
      if (userExists) {
        return res.status(409).send({
          success: false,
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const isVerified = role === "author" ? false : true; // Authors need admin verification

      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        isVerified,
      });

      res.status(201).send({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if (user.role === "author" && !user.isVerified) {
        return res
          .status(403)
          .json({ message: "Author not verified by admin" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.get("signIn.jwtSecret"),
        {
          expiresIn: config.get("signIn.jwtExpiresIn"),
        }
      );

      const loggedInUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      };

      res.status(200).json({
        message: "User logged in successfully",
        data: loggedInUser,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
