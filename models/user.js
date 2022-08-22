const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: String,unique: true , default: null },
  username: { type: String, default: null },
  phone: { type: String, default: null },
  age: { type: String, default: null },
  read_news: { type: String, default: null },
  enable_notification: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String, },
  id_card_verify: { type: String, default: null },
  facebook_id: { type: String, default: null },
  facebook_name: { type: String, default: null },
  facebook_email:{ type: String, default: null },
  facebook_photo:{ type: String, default: null },
  facebook_connected_time:{ type: String, default: null },
  active_now:{ type: String, default: null },
  active_status:{ type: Boolean, default: null },
  last_active:{ type: String, default: null },
  vip:{ type: String, default: null },
  remark:{ type: String, default: null },
  token: { type: String ,default: null },

},{ timestamps: true,
  versionKey: false ,
});

module.exports = mongoose.model("user", userSchema);