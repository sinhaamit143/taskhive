const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true},
    number: { type: Number, required: true },
    //subject: { type: String, required: true },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
