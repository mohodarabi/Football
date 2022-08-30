const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { signupSchema } = require("./secure/signupValidation");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxLength: 255,
    minLength: 4,
  },
  role: {
    type: String,
    default: "user",
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

userSchema.statics.validation = function (body) {
  return signupSchema.validate(body, { abortEarly: false });
};

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) next(err);

    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
