const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Array of products added to the user's shopping cart
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }]
});

module.exports = mongoose.model('User', UserSchema);
