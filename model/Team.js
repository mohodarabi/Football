const mongoose = require('mongoose')

const { teamValidationSchema } = require('./secure/teamValidation')

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  league: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: true,
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

teamSchema.statics.validation = function (body) {
  return teamValidationSchema.validate(body, { abortEarly: false })
}

module.exports = mongoose.model('Team', teamSchema)
