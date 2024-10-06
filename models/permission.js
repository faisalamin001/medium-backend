const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contents",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    accessGranted: { type: Boolean, default: false },
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    grantDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model("Permissions", permissionSchema);

module.exports = Permission;
