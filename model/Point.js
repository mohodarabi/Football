const mongoose = require("mongoose");

const { pointValidationSchema } = require("./secure/pointValidation");

const pointSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  count: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

pointSchema.statics.validation = function (body) {
  return pointValidationSchema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Point", pointSchema);
