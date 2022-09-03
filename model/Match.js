const mongoose = require('mongoose')

const { matchValidationSchema } = require('./secure/matchValidationSchema')

const matchSchema = new mongoose.Schema({
  firstTeam: {
    type: String,
    required: true,
  },
  secondTeam: {
    type: String,
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
    type: String,
    default: 'draw',
  },
  isFinished: {
    type: Boolean,
    default: false,
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
})

matchSchema.statics.validation = function (body) {
  return matchValidationSchema.validate(body, { abortEarly: false })
}

module.exports = mongoose.model('Match', matchSchema)
