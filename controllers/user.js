const { Users } = require("../models");

module.exports = {
  getAllAuthors: async (req, res) => {
    try {
      const authors = await Users.find({ role: "author" });

      const authorsData = authors.map((author) => {
        return {
          id: author._id,
          name: author.name,
          email: author.email,
          role: author.role,
          isVerified: author.isVerified,
        };
      });

      res.status(200).json({
        success: true,
        authors: authorsData,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  verifyAuthor: async (req, res) => {
    try {
      const { authorId } = req.params;
      const { action } = req.body;

      const author = await Users.findById(authorId);

      if (!author) {
        return res.status(404).json({
          success: false,
          message: "Author not found",
        });
      }

      if (author.role !== "author") {
        return res.status(400).json({ message: "User is not an author" });
      }

      if (action === "approve") {
        author.isVerified = true;
      } else if (action === "reject") {
        author.isVerified = false;
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }

      await author.save();

      res.status(200).json({
        success: true,
        message: `Author verification status updated to ${
          action === "approve" ? "approved" : "rejected"
        }`,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
};
