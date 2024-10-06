const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/content");
const authenticateUser = require("../middlewares/authenticateUser");
const authorizeAuthor = require("../middlewares/authorizeAuthor");

router.post(
  "/create/:id",
  authenticateUser,
  authorizeAuthor,
  controller.createContent
);

router.get(
  "/getAllAuthorContent/:authorId",
  authenticateUser,
  authorizeAuthor,
  controller.getAllAuthorContent
);

router.get("/getAllContents", authenticateUser, controller.getAllContents);

router.get(
  "/getAllPublishedContents",
  authenticateUser,
  controller.getAllPublishedContents
);

router.get(
  "/getContentById/:contentId",
  authenticateUser,
  controller.getContentById
);

router.put(
  "/publishContent/:contentId",
  authenticateUser,
  controller.publishContent
);

module.exports = router;
