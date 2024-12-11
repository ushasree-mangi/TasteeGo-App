// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true ,unique: true },
  items: [
    {
      foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
