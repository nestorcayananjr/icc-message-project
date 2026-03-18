const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true},
  valid: { type: Boolean, default: true}
}, { timestamps: true });

module.exports = model("Message", messageSchema)