const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    description: String,
    duration: Number,
    date: Date
  },
  {
    timestamps: {}
  }
);

exerciseSchema.virtual("datestring").get(function() {
  return this.date.toDateString();
});

module.exports = mongoose.model("Exercise", exerciseSchema);
