const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/permission");
const authenticateUser = require("../middlewares/authenticateUser");

router.post(
  "/requestPermission/:contentId",
  authenticateUser,
  controller.requestPermission
);

router.get(
  "/authorPermissionRequests",
  authenticateUser,
  controller.getAuthorPermissionRequests
);

router.post(
  "/grantPermission/:permissionId",
  authenticateUser,
  controller.grantAccess
);

module.exports = router;
