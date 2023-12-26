const mongoose = require("mongoose");
const schema = mongoose.Schema;
const cateSchema = schema(
  {
    name: {
      required: true,
      type: String,
      unique:true
    },
    slug: {
      type: String,
      lowercase:true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("cate", cateSchema);
