const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
   name:String,
   email:String,
   password:String,
   resetToken: {
  type: String
},
resetExpire: {
  type: Date
},

role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
},

isVerified: {
  type: Boolean,
  default: false
},

verifyToken: String,
verifyExpire: Date
});


module.exports = mongoose.model("User", UserSchema);