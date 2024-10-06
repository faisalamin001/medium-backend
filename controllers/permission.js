const { Contents } = require("../models");
const { Permissions } = require("../models");

const requestPermission = async (req, res) => {
  try {
    const { contentId } = req.params; // Content ID from params
    const userId = req.user.userId; // User requesting access (from token)

    // Find the content
    const content = await Contents.findById(contentId).populate("author");
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if the user is the content author (authors can't request their own content)
    if (content.author._id.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You cannot request access to your own content" });
    }

    // Check if the permission request already exists
    const existingPermission = await Permissions.findOne({
      content: contentId,
      user: userId,
    });
    if (existingPermission) {
      return res
        .status(400)
        .json({ message: "Permission request already submitted" });
    }

    // Create a new permission request
    const permissionRequest = new Permissions({
      content: contentId,
      user: userId,
      accessGranted: false, // Access is not granted by default
      grantedBy: content.author._id, // The author is the one who can grant access
    });

    await permissionRequest.save();

    res.status(201).json({
      success: true,
      message: "Permission request submitted successfully",
      data: permissionRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getAuthorPermissionRequests = async (req, res) => {
  try {
    const authorId = req.user.userId;

    const permissionRequests = await Permissions.find()
      .populate({
        path: "content",
        match: { author: authorId },
        select: "title", // Select content fields you want to return
      })
      .populate("user", "name email"); // Populate the user who requested permission

    // Filter out requests for content not belonging to the author
    const filteredRequests = permissionRequests.filter(
      (request) => request.content !== null
    );

    if (!filteredRequests.length) {
      return res
        .status(404)
        .json({ message: "No permission requests found for your content" });
    }

    const filteredRequestsData = filteredRequests.map((request) => {
      return {
        id: request.content._id,
        title: request.content.title,
        user: request.user.name,
        accessGranted: request.accessGranted,
        date: request.createdAt,
        permissionId: request._id,
      };
    });

    res.status(200).json({
      success: true,
      data: filteredRequestsData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const grantAccess = async (req, res) => {
  try {
    const { permissionId } = req.params; // Permission ID from params
    const authorId = req.user.userId; // Author ID from authenticated user

    // Find the permission request
    const permission = await Permissions.findById(permissionId).populate(
      "content"
    );

    if (!permission) {
      return res.status(404).json({ message: "Permission request not found" });
    }

    // Check if the authenticated user is the author of the content
    if (permission.content.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You do not have permission to grant access to this content",
      });
    }

    // Grant access by updating the accessGranted field
    permission.accessGranted = true;
    await permission.save();

    res.status(200).json({
      success: true,
      message: "Access granted successfully",
      data: permission,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  requestPermission,
  getAuthorPermissionRequests,
  grantAccess,
};
