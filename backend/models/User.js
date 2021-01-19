const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  accountType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  friendrequestsent: [
    {
      type: String,
    },
  ],
  inbox: [
    {
      type: String,
    },
  ],
  friendlist: [
    {
      type: String,
    },
  ],
  privateKey: (
    {type:String}
  )
});
module.exports = User = mongoose.model("user", userSchema);
