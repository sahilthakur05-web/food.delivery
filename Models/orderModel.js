  const mongoose = require("mongoose");
const schema = mongoose.Schema;
const orderSchema = schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "pro",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
