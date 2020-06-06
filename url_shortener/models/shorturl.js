const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoIdName = "ShortUrlAutoIncId";

const ShortUrlAutoIncIdSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true }
});

ShortUrlAutoIncIdSchema.statics.getNextSequence = function() {
  return this.findOneAndUpdate({ _id: autoIdName }, { $inc: { seq: 1 } });
};

ShortUrlAutoIncIdSchema.methods.saveOnlyOnce = function() {
  this._id = autoIdName;
  this.seq = 1;
  return this.save();
};
const ShortUrlAutoIncId = mongoose.model(
  "ShortUrlAutoIncId",
  ShortUrlAutoIncIdSchema
);
const shorturlSchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, index: true, unique: true }
  },
  { timestamps: {} }
);

shorturlSchema.methods.saveAutoId = async function() {
  let res = await ShortUrlAutoIncId.getNextSequence();
  if (!res) {
    res = await new ShortUrlAutoIncId().saveOnlyOnce();
  }
  this._id = res.seq;
  return this.save();
};

module.exports = mongoose.model("ShortUrl", shorturlSchema);
