const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = schema(
  {
    username: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: Number,
      default:0
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
