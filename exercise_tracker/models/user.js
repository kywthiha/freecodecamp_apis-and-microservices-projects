const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    log: [{ type: Schema.Types.ObjectId, ref: "Exercise" }]
  },
  {
    timestamps: {}
  }
);

userSchema.methods.addExercise = function(id) {
  if (this.log.indexOf(id) === -1) {
    this.log.push(id);
  }
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
