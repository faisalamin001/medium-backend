const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/purchase");
const authenticateUser = require("../middlewares/authenticateUser");

router.post(
  "/purchaseContent/:contentId",
  authenticateUser,
  controller.purchaseContent
);

router.get(
  "/getAllAuthorPurchases/:authorId",
  authenticateUser,
  controller.getAllAuthorPurchases
);

module.exports = router;
