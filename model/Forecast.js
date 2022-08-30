const mongoose = require("mongoose");

const {
  forecastValidationSchema,
} = require("./secure/forecastValidationSchema");

const forecastSchema = new mongoose.Schema({
  result: {
    type: Object,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  match: {
    type: Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    default: "draw",
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

forecastSchema.statics.validation = function (body) {
  return forecastValidationSchema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Forecast", forecastSchema);
