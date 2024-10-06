const express = require("express");
const router = express.Router();

// Routers
const userRouter = require("./user");
const authRouter = require("./auth");
const contentRouter = require("./content");
const purchaseRouter = require("./purchase");
const permissionRouter = require("./permission");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/content", contentRouter);
router.use("/purchase", purchaseRouter);
router.use("/permission", permissionRouter);

module.exports = router;
