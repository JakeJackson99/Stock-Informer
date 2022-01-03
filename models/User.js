const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      maxlength: 255,
      require: true,
      unique: trues,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      require: true,
      unique: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    items: [{
      name: {
        type: String,
        unique: true,
        require: true,
        minlength: 1,
        maxlength: 20,
      },
      stockCount: {
        type: Number,
        default: 0,
        require: true,
        minlength: 0,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
