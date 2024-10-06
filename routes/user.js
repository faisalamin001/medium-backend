const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/user");
const authenticateUser = require("../middlewares/authenticateUser");

router.get("/getAllAuthors", authenticateUser, controller.getAllAuthors);

router.put(
  "/verifyAuthor/:authorId",
  authenticateUser,
  controller.verifyAuthor
);

module.exports = router;
