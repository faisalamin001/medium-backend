const Users = require("../models/user");

const authorAuth = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Find the user by ID
    const user = await Users.findById(userId);

    // Check if the user is an author and verified
    if (user.role !== "author") {
      return res
        .status(403)
        .json({ message: "Access denied: Only authors are allowed" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Access denied: Author is not verified" });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = authorAuth;
