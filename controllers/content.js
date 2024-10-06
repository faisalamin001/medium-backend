const { Contents } = require("../models");
const { Purchases } = require("../models");
const { Permissions } = require("../models");

module.exports = {
  createContent: async (req, res) => {
    try {
      const { title, description, tag, type } = req.body;
      const authorId = req.user.userId;

      const content = new Contents({
        title,
        description,
        tag,
        type,
        author: authorId,
      });

      await content.save();

      res.status(201).json({
        success: true,
        message: "Content created successfully",
        data: content,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getAllAuthorContent: async (req, res) => {
    try {
      const { authorId } = req.params;

      const contents = await Contents.find({ author: authorId });

      if (!contents.length) {
        return res
          .status(404)
          .json({ message: "No content found for this author" });
      }
      const contentsData = contents.map((content) => {
        return {
          id: content._id,
          title: content.title,
          description: content.description,
          tag: content.tag,
          type: content.type,
          isPublished: content.isPublished,
          createdAt: content.createdAt,
        };
      });

      res.status(200).json({
        success: true,
        data: contentsData,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getAllContents: async (req, res) => {
    try {
      const contents = await Contents.find().populate("author", "name");
      if (!contents.length) {
        return res.status(404).json({ message: "No content found" });
      }

      const contentsData = contents.map((content) => {
        return {
          id: content._id,
          title: content.title,
          description: content.description,
          tag: content.tag,
          type: content.type,
          isPublished: content.isPublished,
          createdAt: content.createdAt,
          author: content.author.name,
        };
      });

      res.status(200).json({
        success: true,
        data: contentsData,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getAllPublishedContents: async (req, res) => {
    try {
      const contents = await Contents.find({ isPublished: true }).populate(
        "author",
        "name"
      );

      if (!contents.length) {
        return res.status(404).json({ message: "No content found" });
      }

      const contentsData = contents.map((content) => {
        return {
          id: content._id,
          title: content.title,
          description:
            content.description.length > 150
              ? content.description.substring(0, 150) + "..."
              : content.description,
          tag: content.tag,
          type: content.type,
          isPublished: content.isPublished,
          createdAt: content.createdAt,
          author: content.author.name,
        };
      });

      res.status(200).json({
        success: true,
        data: contentsData,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getContentById2: async (req, res) => {
    try {
      const { contentId } = req.params;
      const content = await Contents.findById(contentId);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getContentById: async (req, res) => {
    try {
      const { contentId } = req.params;
      const userId = req.user.userId; // Assume userId is available from token
      const role = req.user.role; // User role from the token

      const content = await Contents.findById(contentId).populate("author");

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // If the user is an admin or the author, send the full article
      if (
        role === "admin" ||
        (role === "author" && content.author._id.toString() === userId)
      ) {
        return res.status(200).json({
          success: true,
          data: {
            ...content.toObject(),
            restricted: false,
          },
        });
      }

      // Check if the user has purchased the content
      const purchase = await Purchases.findOne({
        user: userId,
        content: contentId,
      });

      // Check if the user has been granted access by the author
      const permission = await Permissions.findOne({
        user: userId,
        content: contentId,
        accessGranted: true,
      });

      // If the user has either purchased or been granted permission, send the full article
      if (purchase || permission) {
        return res.status(200).json({
          success: true,
          data: {
            ...content.toObject(),
            restricted: false,
          },
        });
      }

      const restrictedDescription =
        "You don't have permission to read the full article. Either purchase it or request access from the author.";

      return res.status(200).json({
        success: true,
        data: {
          ...content.toObject(), // Spread other content fields
          description: restrictedDescription, // Override the description field
          restricted: true,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  publishContent: async (req, res) => {
    try {
      const { contentId } = req.params;
      const { action } = req.body;

      // Find the content by ID
      const content = await Contents.findById(contentId);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      if (action === "publish") {
        content.isPublished = true;
      } else if (action === "unpublish") {
        content.isPublished = false;
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }

      await content.save();

      res.status(200).json({
        success: true,
        message: `Content ${
          action === "publish" ? "published" : "unpublished"
        } successfully`,
        data: content,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
