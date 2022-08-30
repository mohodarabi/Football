const mongoose = require("mongoose");

const { schema } = require("./secure/postValidation");

const bloghSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  body: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["private", "public"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bloghSchema.index({ title: "text" });

bloghSchema.statics.validation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Blog", bloghSchema);
