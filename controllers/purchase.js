const { Purchases } = require("../models");
const { Contents } = require("../models");

// Controller for purchasing content
const purchaseContent = async (req, res) => {
  try {
    const { contentId } = req.params; // Get contentId from params
    const userId = req.user.userId; // Assuming user is authenticated and userId is available in req.user

    // Check if the content exists
    const content = await Contents.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if the user already purchased the content
    const existingPurchase = await Purchases.findOne({
      user: userId,
      content: contentId,
    });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ message: "You have already purchased this content" });
    }

    // Create a new purchase record
    const purchase = new Purchases({
      user: userId,
      content: contentId,
    });

    await purchase.save();

    res.status(201).json({
      success: true,
      message: "Content purchased successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllAuthorPurchases = async (req, res) => {
  try {
    const { authorId } = req.params; // Get authorId from params

    // Find all purchases where the content's author matches the authorId
    const purchases = await Purchases.find()
      .populate({
        path: "content",
        match: { author: authorId }, // Match content by authorId
        select: "title author", // Select relevant fields to return
      })
      .populate("user", "name email"); // Optionally populate the user who purchased

    // Filter out purchases where the content does not belong to the author
    const filteredPurchases = purchases.filter(
      (purchase) => purchase.content !== null
    );

    if (!filteredPurchases.length) {
      return res
        .status(404)
        .json({ message: "No purchases found for this author" });
    }
    const filteredPurchasesData = purchases.map((purchase) => {
      return {
        id: purchase.content._id,
        title: purchase.content.title,
        user: purchase.user.name,
        purchaseDate: purchase.purchaseDate,
      };
    });

    res.status(200).json({
      success: true,
      data: filteredPurchasesData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  purchaseContent,
  getAllAuthorPurchases,
};
