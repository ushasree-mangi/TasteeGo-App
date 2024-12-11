// models/FoodItem.js
const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
    required: true,
  },
  url :{
    type:String,
    required: true,
  }
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;
