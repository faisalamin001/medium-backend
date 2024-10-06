const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/auth");

// Route to handle user registration
router.post("/register", controller.register);

// Route to handle user login
router.post("/login", controller.login);

module.exports = router;
