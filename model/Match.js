const mongoose = require("mongoose");

const { matchValidationSchema } = require("./secure/matchValidationSchema");

const matchSchema = new mongoose.Schema({
  firstTeam: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  secondTeam: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  startForecast: {
    type: Date,
    required: true,
  },
  endForecast: {
    type: Date,
    required: true,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    default: "draw",
  },
  result: {
    type: Object,
    default: {},
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

matchSchema.statics.validation = function (body) {
  return matchValidationSchema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Match", matchSchema);
