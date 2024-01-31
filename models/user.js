const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
      name: { type: String, required: true },
      email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
      },
      password: {
        type: String,
        trim: true,
        minLength: 6,
        required: true,
      },
      role: {
        type: String,
        default: "user",
        required: true,
      },
    },
    {
      timestamps: true,
      toJSON: {
        transform: (_, ret) => {
          delete ret.password;
          return ret;
        },
      },
    },
  );
  
  userSchema.pre("save", async function (next) {
    // 'this' is the user doc
    if (!this.isModified("password")) {
      return next();
    }
    // update the password with the computed hash
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next();
  });
  
  module.exports = mongoose.model("User", userSchema);
  
  module.exports = model("User", userSchema);